import traceback, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(os.environ.get("VOID_EAGER_TEST_OUT", tempfile.gettempdir()))
passed=[]
def mark(name):
 passed.append(name)
 print("PASS "+name,flush=True)
def see(page,slug):
 if page.viewport_size["width"]==1464:
  page.screenshot(path=str(OUT/("VOID-EAGER-P0A-"+slug+".png")))
def main_route(page,pin):
 page.goto("http://127.0.0.1:5173/",wait_until="domcontentloaded")
 page.get_by_test_id("begin-coupler-investigation").click()
 page.get_by_test_id("inspect-work-order").click()
 page.get_by_test_id("inspect-wo-parts").click()
 page.get_by_test_id("close-evidence").click()
 page.get_by_test_id("choose-intention-trace-part").click()
 page.clock.fast_forward(12500)
 page.get_by_test_id("incoming-interruption").wait_for()
 assert "C-17" in page.get_by_test_id("incoming-interruption").inner_text()
 if pin:
  page.get_by_test_id("pin-current-context").click()
  page.get_by_test_id("pin-choices").wait_for()
  page.get_by_test_id("save-selected-pin").click()
  assert "CONTEXT SAVED" in page.get_by_test_id("incoming-interruption").inner_text()
  page.get_by_test_id("handle-interruption-now").click()
 else:
  page.get_by_test_id("minimize-incident").click()
  assert page.get_by_test_id("pending-incident-tab").is_visible()
  page.get_by_test_id("back-to-maintenance").click()
  page.get_by_test_id("maintenance-hub-exit").click()
  page.get_by_test_id("hub-scene").wait_for()
  assert page.get_by_test_id("pending-incident-tab").is_visible()
  page.get_by_test_id("hub-visit-storage").click()
  page.get_by_test_id("storage-scene").wait_for()
  assert page.get_by_test_id("pending-incident-tab").is_visible()
  see(page,"pending-at-storage")
  page.get_by_test_id("pending-incident-tab").click()
  page.get_by_test_id("incoming-interruption").wait_for()
  page.get_by_test_id("handle-interruption-now").click()
 page.get_by_test_id("secondary-scene").wait_for()
 page.get_by_label("Log sensor mismatch and continue monitoring").check()
 page.get_by_test_id("confirm-classification").click()
 page.get_by_test_id("return-investigation").click()
 page.get_by_test_id("hub-scene").wait_for()
 if pin:
  page.get_by_test_id("quick-pin-entry").locator("summary").click()
  page.get_by_test_id("resume-pin").click()
 else:
  page.get_by_test_id("open-coupler-thread").click()
 page.get_by_test_id("workstation-focus").wait_for()
 assert page.get_by_test_id("choose-intention-trace-part").get_attribute("aria-pressed")=="true"
 if page.get_by_test_id("unlock-storage-lead").is_enabled():
  page.get_by_test_id("unlock-storage-lead").click()
 page.get_by_test_id("storage-lead").click()
 page.get_by_test_id("storage-scene").wait_for()
 page.get_by_test_id("storage-open-crate").click()
 page.get_by_test_id("close-evidence").click()
 page.get_by_test_id("inspect-storage-coupler").click()
 page.get_by_test_id("close-evidence").click()
 page.get_by_test_id("check-storage-serial").click()
 page.get_by_test_id("storage-evidence").wait_for()
 page.get_by_test_id("close-evidence").click()
 page.get_by_test_id("storage-compare-sources").click()
 page.get_by_test_id("serial-comparison").wait_for()
 page.get_by_test_id("save-comparison").click()
 page.get_by_test_id("close-evidence").click()
 page.get_by_test_id("storage-back-hub").click()
 page.get_by_test_id("hub-open-case-review").click()
 page.get_by_label("The recorded replacement did not actually happen.").check()
 page.get_by_label("Storage B-04: the replacement Coupler was observed unused.").check()
 page.get_by_test_id("save-theory").click()
 page.get_by_test_id("case-review-back-hub").click()
 page.get_by_test_id("hub-end-session").click()
 page.get_by_test_id("reflection-scene").wait_for()
 return page.get_by_test_id("reflection-scene").inner_text()

with sync_playwright() as p:
 browser=p.chromium.launch(channel="chrome",headless=True)
 for pin in (False,True):
  page=browser.new_page(viewport={"width":1464,"height":815})
  page.clock.install()
  page.set_default_timeout(9000)
  errors=[]
  page.on("pageerror", lambda e:errors.append(str(e)))
  try:
   final=main_route(page,pin)
   assert "You completed the prototype loop" in final
   assert "Quick Pin used: "+("Yes" if pin else "No") in final
   assert not errors,errors
   mark("Complete Loop 1 with Pin="+str(pin)+", including C-17 and Reflection")
  except Exception as e:
   print("FAIL FULL_LOOP PIN",pin,type(e).__name__,str(e)[:1150],flush=True)
   print(traceback.format_exc()[-1200:],flush=True)
   try:page.screenshot(path=str(OUT/f"VOID-EAGER-P0A-failure-loop-{pin}.png"))
   except Exception:pass
  finally:page.close()
 for w,h in ((1024,576),(1280,720),(1464,815),(1920,1080)):
  page=browser.new_page(viewport={"width":w,"height":h})
  page.clock.install()
  page.set_default_timeout(9000)
  try:
   page.goto("http://127.0.0.1:5173/",wait_until="domcontentloaded")
   page.get_by_test_id("mission-briefing").get_by_text("EXPLORE ROOM").click()
   page.get_by_test_id("maintenance-hub-exit").click()
   page.get_by_test_id("hub-scene").wait_for()
   hub=page.locator(".hub-screen-interface")
   buttons=[page.get_by_test_id("open-coupler-thread"),page.get_by_test_id("hub-visit-storage"),page.get_by_test_id("open-power-thread")]
   assert all(b.count()==1 and b.is_enabled() for b in buttons)
   dims=hub.evaluate("""e=>({clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,overflow:getComputedStyle(e).overflowY})""")
   print("HUB_LAYOUT",f"{w}x{h}",dims,flush=True)
   if w==1464:page.screenshot(path=str(OUT/"VOID-EAGER-P0A-new-hub.png"))
   mark(f"Hub both locations accessible before C-17 at {w}x{h}")
  except Exception as e:
   print("FAIL HUB",w,type(e).__name__,str(e)[:550],flush=True)
  finally:page.close()
 browser.close()
 if len(passed) != 6:
  raise RuntimeError(f'Only {len(passed)} of 6 P0-A test paths passed')
 print("TOTAL_PASS",len(passed),flush=True)
