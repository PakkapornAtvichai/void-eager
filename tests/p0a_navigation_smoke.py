import traceback, json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
from physical_nav import hub_to_maintenance, hub_to_workstation, hub_to_storage, workstation_to_storage, storage_to_hub, hub_to_power
OUT=Path(os.environ.get("VOID_EAGER_TEST_OUT", tempfile.gettempdir()))
passed=[]
def mark(name): passed.append(name); print("PASS "+name,flush=True)
def begin(page):
 page.goto("http://127.0.0.1:5173/",wait_until="domcontentloaded")
 page.get_by_test_id("begin-coupler-investigation").click()
 page.get_by_test_id("inspect-work-order").click()
def close(page): page.get_by_test_id("close-evidence").click()
def field(page,f):
 page.get_by_test_id("inspect-wo-"+f).click()
 page.get_by_test_id("workorder-field-dialog").wait_for()
def scene(page,s):
 page.get_by_test_id(s).wait_for()
 return page.get_by_test_id(s)
with sync_playwright() as p:
 browser=p.chromium.launch(channel="chrome",headless=True)
 for w,h in ((1280,720),(1464,815),(1920,1080),(1024,576)):
  page=browser.new_page(viewport={"width":w,"height":h},device_scale_factor=1)
  page.clock.install()
  page.set_default_timeout(8500)
  errors=[]
  page.on("pageerror", lambda error:errors.append(str(error)))
  try:
   begin(page)
   assert page.get_by_test_id("unlock-storage-lead").count()==0
   assert page.get_by_test_id("active-investigation-focus").count()==0
   assert page.get_by_test_id("workorder-intentions").count()==0
   field(page,"service")
   assert "twelve days" in page.get_by_test_id("workorder-field-dialog").inner_text()
   close(page)
   assert page.get_by_test_id("workorder-intentions").count()==0
   field(page,"completion")
   assert "COUPLER REPLACED" in page.get_by_test_id("workorder-field-dialog").inner_text()
   close(page)
   assert page.get_by_test_id("workstation-focus-select").locator("option[value=\"check-completion\"]").count()==1
   assert page.get_by_test_id("workstation-focus-select").locator("option[value=\"trace-part\"]").count()==0
   page.get_by_test_id("workstation-focus-select").select_option("check-completion")
   assert page.get_by_test_id("workstation-focus-select").input_value()=="check-completion"
   field(page,"parts")
   modal=scene(page,"workorder-field-dialog")
   details=modal.inner_text()
   assert "STORAGE B-04" in details and "NOT ATTACHED" in details
   assert "INVESTIGATOR'S QUESTION" not in details
   close(page)
   page.get_by_test_id("workstation-focus-select").select_option("trace-part")
   assert page.get_by_test_id("workstation-focus-select").input_value()=="trace-part"
   assert page.get_by_test_id("workstation-focus-select").input_value()=="trace-part"
   assert page.get_by_test_id("unlock-storage-lead").is_enabled()
   if w==1464: page.screenshot(path=str(OUT/"VOID-EAGER-P0A-workstation-focus.png"))
   page.get_by_test_id("unlock-storage-lead").click()
   assert page.get_by_test_id("storage-lead").is_visible()
   assert "Empty" in page.get_by_test_id("quick-pin-entry").inner_text()
   workstation_to_storage(page)
   scene(page,"storage-scene")
   assert page.get_by_test_id("pending-incident-tab").count()==0
   if w==1464: page.screenshot(path=str(OUT/"VOID-EAGER-P0A-storage-before-c17.png"))
   page.get_by_test_id("storage-open-crate").click()
   close(page)
   page.get_by_test_id("inspect-storage-coupler").click()
   close(page)
   page.get_by_test_id("check-storage-serial").click()
   assert "UNIT SERIAL: GSC-8842-A" in scene(page,"storage-evidence").inner_text()
   close(page)
   storage_to_hub(page)
   scene(page,"hub-scene")
   assert page.get_by_test_id("hub-maintenance-door").is_visible()
   hub_to_workstation(page)
   scene(page,"workstation-focus")
   assert page.get_by_test_id("workstation-focus-select").input_value()=="trace-part"
   assert page.get_by_test_id("unlock-storage-lead").is_disabled()
   assert page.get_by_test_id("workorder-field-dialog").count()==0
   mark(f"WO fields, focus persistence, Storage before C-17, return {w}x{h}")
   assert len(errors)==0,errors
  except Exception as e:
   print(f"FAIL {w}x{h} {type(e).__name__} {str(e)[:1100]}",flush=True)
   print(traceback.format_exc()[-850:],flush=True)
   try:page.screenshot(path=str(OUT/f"VOID-EAGER-P0A-failure-{w}.png"))
   except Exception:pass
  finally:page.close()
 # Storage-first exploration should not reveal unobserved document data.
 page=browser.new_page(viewport={"width":1464,"height":815})
 page.clock.install()
 page.set_default_timeout(8500)
 try:
  page.goto("http://127.0.0.1:5173/",wait_until="domcontentloaded")
  page.get_by_test_id("mission-briefing").get_by_text("EXPLORE ROOM").click()
  page.get_by_test_id("maintenance-hub-exit").click()
  scene(page,"hub-scene")
  assert page.get_by_test_id("hub-maintenance-door").is_visible()
  assert "No case evidence inspected yet" in page.get_by_test_id("hub-case-board").inner_text()
  hub_to_storage(page)
  scene(page,"storage-scene")
  page.get_by_test_id("storage-open-crate").click()
  close(page)
  page.get_by_test_id("inspect-storage-coupler").click()
  close(page)
  page.get_by_test_id("check-storage-serial").click()
  physical_serial=scene(page,"storage-evidence").inner_text()
  assert "UNIT SERIAL: GSC-8842-A" in physical_serial,physical_serial
  assert "COUPLER REPLACED" not in page.get_by_test_id("storage-detail-dialog").inner_text()
  assert page.get_by_test_id("serial-comparison").count()==0
  assert page.get_by_test_id("storage-compare-sources").count()==0
  page.screenshot(path=str(OUT/"VOID-EAGER-P0A-storage-first-no-spoiler.png"))
  close(page)
  storage_to_hub(page)
  scene(page,"hub-scene")
  assert page.get_by_test_id("hub-open-case-review").is_visible()
  page.get_by_test_id("hub-open-case-review").click()
  scene(page,"deduction-scene")
  assert "Maintenance work order says" not in page.get_by_test_id("deduction-scene").inner_text()
  assert "replacement Coupler was observed unused" in page.get_by_test_id("deduction-scene").inner_text()
  page.get_by_test_id("case-review-back-hub").click()
  scene(page,"hub-scene")
  hub_to_workstation(page)
  scene(page,"workstation-focus")
  page.get_by_test_id("inspect-work-order").click()
  field(page,"parts")
  close(page)
  assert page.get_by_test_id("workstation-focus-select").locator("option[value=\"trace-part\"]").count()==1
  mark("Storage-first path preserves hidden Work Order info and later field access")
 except Exception as e:
  print("FAIL STORAGE_FIRST",type(e).__name__,str(e)[:1300],flush=True)
  print(traceback.format_exc()[-950:],flush=True)
  try:page.screenshot(path=str(OUT/"VOID-EAGER-P0A-failure-storage-first.png"))
  except Exception:pass
 finally: page.close()
 print("TOTAL_PASS",len(passed),flush=True)
 browser.close()
 if len(passed) != 5:
  raise RuntimeError(f'Only {len(passed)} of 5 P0-A test paths passed')
