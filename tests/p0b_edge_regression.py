import traceback, os, tempfile
from pathlib import Path
OUT = Path(os.environ.get('VOID_EAGER_TEST_OUT', tempfile.gettempdir()))
OUT.mkdir(parents=True, exist_ok=True)
from playwright.sync_api import sync_playwright
from physical_nav import hub_to_maintenance, hub_to_workstation, hub_to_storage, workstation_to_storage, storage_to_hub, hub_to_power
with sync_playwright() as p:
 browser=p.chromium.launch(channel="chrome",headless=True)
 page=browser.new_page(viewport={"width":1464,"height":815})
 page.clock.install();page.set_default_timeout(9000)
 try:
  page.goto("http://127.0.0.1:5173/")
  page.get_by_test_id("begin-coupler-investigation").click()
  page.get_by_test_id("inspect-work-order").click()
  page.get_by_test_id("inspect-wo-parts").click()
  page.get_by_test_id("close-evidence").click()
  page.get_by_test_id("choose-intention-trace-part").click()
  r=page.get_by_test_id("workstation-report")
  r.evaluate("e=>{e.scrollTop=100;e.dispatchEvent(new Event('scroll',{bubbles:true}))}")
  before=r.evaluate("e=>e.scrollTop")
  print("WORKSTATION_SCROLL_BEFORE",before,flush=True)
  page.clock.fast_forward(7100)
  page.get_by_test_id("incoming-interruption").wait_for()
  page.get_by_test_id("pin-current-context").click()
  print("PIN_RADIO_FOCUS",page.evaluate("document.activeElement?.getAttribute('name')"),flush=True)
  page.get_by_test_id("cancel-pin").click()
  page.get_by_test_id("handle-interruption-now").click()
  page.get_by_label("Log sensor mismatch and continue monitoring").check()
  page.get_by_test_id("confirm-classification").click()
  page.get_by_test_id("return-previous-task").click()
  page.get_by_test_id("workstation-focus").wait_for()
  after=page.get_by_test_id("workstation-report").evaluate("e=>e.scrollTop")
  print("WORKSTATION_SCROLL_AFTER",after,flush=True)
  assert abs(before-after)<=3,"Scroll position lost"
  page.clock.fast_forward(50000)
  assert page.get_by_test_id("incoming-interruption").count()==0,"C17 replayed"
  print("PASS scroll restoration and C17 single-fire",flush=True)
 except Exception as e:
  print("FAIL",str(e),traceback.format_exc()[-1200:],flush=True)
  raise
 finally:page.close()
 # remote origin
 page=browser.new_page(viewport={"width":1464,"height":815})
 page.clock.install();page.set_default_timeout(9000)
 try:
  page.goto("http://127.0.0.1:5173/")
  page.get_by_test_id("mission-briefing").get_by_text("EXPLORE ROOM").click()
  page.get_by_test_id("maintenance-hub-exit").click()
  hub_to_storage(page)
  page.get_by_test_id("storage-open-crate").click();page.get_by_test_id("close-evidence").click()
  page.get_by_test_id("inspect-storage-coupler").click();page.get_by_test_id("close-evidence").click()
  page.clock.fast_forward(7150)
  page.get_by_test_id("incoming-interruption").wait_for()
  page.get_by_test_id("handle-interruption-now").click()
  page.get_by_test_id("secondary-scene").wait_for()
  assert page.locator(".secondary-remote-background").is_visible(),"Storage incident wrongly shows Workstation background"
  assert page.locator(".secondary-workstation-background").count()==0
  print("PASS remote C17 generic system backdrop for Storage",flush=True)
  page.screenshot(path=str(OUT/"c17-from-storage-remote-console.png"))
 except Exception as e:
  print("FAIL REMOTE",str(e),traceback.format_exc()[-1200:],flush=True)
  raise
 finally:page.close();browser.close()
