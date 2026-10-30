from pathlib import Path
import os, tempfile, json, traceback
from playwright.sync_api import sync_playwright

OUT = Path(os.environ.get("VOID_EAGER_TEST_OUT", tempfile.gettempdir()))
OUT.mkdir(parents=True, exist_ok=True)
BASE="http://127.0.0.1:5173/"
passed=[]
issues=[]
def r(page,selector):
 el=page.locator(selector)
 if not el.count():return None
 box=el.first.bounding_box()
 return box
def intersects(a,b):
 if not a or not b:return False
 return a["x"] < b["x"]+b["width"] and a["x"]+a["width"]>b["x"] and a["y"]<b["y"]+b["height"] and a["y"]+a["height"]>b["y"]
def check(cond,text):
 if not cond:raise AssertionError(text)
def snap(page,s):page.screenshot(path=str(OUT/f"after-{s}.png"))
def one(browser,w,h):
 page=browser.new_page(viewport={"width":w,"height":h},device_scale_factor=1)
 page.clock.install()
 page.set_default_timeout(8500)
 errors=[]
 page.on("pageerror",lambda e:errors.append(str(e)))
 try:
  page.goto(BASE)
  brief=page.get_by_test_id("mission-briefing")
  brief.wait_for()
  check(brief.get_attribute("role")=="dialog","Opening brief is not a dialog")
  check(page.get_by_test_id("current-objective").count()==0,"Objective should be hidden behind opening brief")
  check(page.evaluate("document.activeElement?.getAttribute('data-testid')")=="begin-coupler-investigation","Opening default focus")
  check(r(page,".case-brief-dialog")["width"]<=535,"Brief too wide")
  check(r(page,".case-brief-dialog")["x"]>r(page,".game-stage")["x"],"Brief offstage")
  snap(page,f"brief-{w}x{h}")
  page.get_by_test_id("mission-briefing").get_by_text("EXPLORE ROOM").click()
  check(page.get_by_test_id("mission-briefing").count()==0,"Brief persisted after explore")
  stage=r(page,".game-stage"); hub=r(page,".maintenance-hub-exit"); obj=r(page,".objective-tracker"); hud=r(page,".game-hud")
  check(hub["x"]-stage["x"] < stage["width"]*.1,"Hub button not at left corner")
  check(hub["y"]-stage["y"] < stage["height"]*.09,"Hub button too low")
  check(not intersects(hub,obj),"Hub overlaps objective")
  check(obj["width"]<=480,"Objective not slim")
  check(not intersects(obj,hud),"Objective overlaps HUD")
  page.mouse.move(stage["x"]+stage["width"]*.5,stage["y"]+stage["height"]*.12)
  label=page.get_by_test_id("workbench-hotspot").locator(".world-hotspot__label")
  check(float(label.evaluate("x=>getComputedStyle(x).opacity"))<=0.05,"Hotspot labels still always visible")
  snap(page,f"room-{w}x{h}")
  page.get_by_test_id("workbench-hotspot").hover()
  page.wait_for_function("() => Number(getComputedStyle(document.querySelector('[data-testid=workbench-hotspot] .world-hotspot__label')).opacity) >= .9",timeout=1600)
  snap(page,f"hotspot-hover-{w}x{h}")
  page.mouse.move(stage["x"]+stage["width"]*.5,stage["y"]+stage["height"]*.12)
  # On-demand case brief is not a second permanent panel.
  page.get_by_test_id("objective-hint-toggle").click()
  hint=page.get_by_test_id("objective-hint-dialog")
  hint.wait_for()
  check(page.evaluate("document.activeElement?.getAttribute('data-testid')")=="close-evidence","Hint's Close not focused")
  page.keyboard.press("Tab")
  check(page.evaluate("document.activeElement?.getAttribute('data-testid')")=="reopen-case-brief","Hint action not keyboard accessible")
  page.get_by_test_id("reopen-case-brief").click()
  check(page.get_by_test_id("objective-hint-dialog").count()==0,"Hint remains under Case Brief")
  page.get_by_test_id("mission-briefing").wait_for()
  page.keyboard.press("Escape")
  check(page.get_by_test_id("mission-briefing").count()==0,"Escape did not close brief")
  check(page.get_by_test_id("current-objective").is_visible(),"Objective did not return")
  page.get_by_test_id("maintenance-hub-exit").click()
  page.get_by_test_id("hub-scene").wait_for()
  snap(page,f"hub-{w}x{h}")
  check(page.get_by_test_id("hub-visit-storage").is_visible(),"Storage missing from Hub")
  page.get_by_test_id("hub-visit-storage").click()
  page.get_by_test_id("storage-scene").wait_for()
  snap(page,f"storage-{w}x{h}")
  check(page.get_by_test_id("storage-open-crate").is_visible(),"Storage open unavailable")
  check(len(errors)==0,str(errors))
  passed.append(f"screen + keyboard + destinations {w}x{h}")
  print("PASS "+passed[-1],json.dumps({"stage":stage,"brief":r(page,".case-brief-dialog"),"hub":hub,"objective":obj,"hud":hud}),flush=True)
 except Exception as exc:
  issues.append(f"{w}x{h} {type(exc).__name__}: {str(exc)[:550]}")
  print("FAIL "+issues[-1],flush=True)
  print(traceback.format_exc()[-1200:],flush=True)
  snap(page,f"FAIL-{w}x{h}")
 finally:page.close()

with sync_playwright() as p:
 browser=p.chromium.launch(channel="chrome",headless=True)
 for size in [(1024,576),(1280,720),(1464,815),(1920,1080)]:
  one(browser,*size)
 # Check keyboard initial dialog and Workstation path separately.
 pg=browser.new_page(viewport={"width":1464,"height":815})
 pg.clock.install()
 pg.goto(BASE)
 pg.get_by_test_id("mission-briefing").wait_for()
 check(pg.evaluate("document.activeElement?.getAttribute('data-testid')")=="begin-coupler-investigation","Dialog initial focus")
 pg.keyboard.press("Tab")
 check(pg.evaluate("document.activeElement?.textContent?.trim()")=="EXPLORE ROOM","Dialog next action not tabbable")
 pg.keyboard.press("Tab")
 check(pg.evaluate("document.activeElement?.getAttribute('data-testid')")=="close-case-brief","Dialog focus did not wrap")
 pg.keyboard.press("Shift+Tab")
 check(pg.evaluate("document.activeElement?.textContent?.trim()")=="EXPLORE ROOM","Dialog reverse tab did not wrap")
 pg.get_by_test_id("begin-coupler-investigation").click()
 pg.get_by_test_id("workstation-focus").wait_for()
 check(pg.get_by_test_id("mission-briefing").count()==0,"Brief stuck on Workstation")
 pg.get_by_test_id("inspect-work-order").click()
 pg.get_by_test_id("inspect-wo-parts").click()
 pg.get_by_test_id("close-evidence").click()
 snap(pg,"workstation-1464x815")
 pg.close()

 touch=browser.new_context(viewport={"width":1024,"height":576},has_touch=True)
 tp=touch.new_page()
 tp.goto(BASE)
 tp.get_by_test_id("mission-briefing").get_by_text("EXPLORE ROOM").click()
 assert tp.evaluate("matchMedia('(pointer: coarse)').matches")
 tl=tp.get_by_test_id("workbench-hotspot").locator(".world-hotspot__label")
 check(float(tl.evaluate("x=>getComputedStyle(x).opacity"))>=.9,"Touch hotspot label hidden")
 tp.get_by_test_id("workbench-hotspot").tap()
 check(tp.get_by_test_id("maintenance-inspection-workbench").is_visible(),"Touch target failed")
 print("PASS touch/coarse pointer: accessible visible labels and Workbench inspection",flush=True)
 touch.close()
 browser.close()
print("PASSED",len(passed),"ISSUES",len(issues),flush=True)
if issues:raise RuntimeError("; ".join(issues))
