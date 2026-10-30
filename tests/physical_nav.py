"""Physical room routes shared by browser regression tests.

Movement belongs to visible door/room hotspots, never the central Hub case computer.
"""
def hub_to_maintenance(page):
    page.get_by_test_id("hub-maintenance-door").click()
    page.get_by_test_id("maintenance-room").wait_for()

def hub_to_workstation(page):
    hub_to_maintenance(page)
    page.get_by_test_id("workstation-hotspot").click()
    page.get_by_test_id("workstation-focus").wait_for()

def hub_to_storage(page):
    hub_to_maintenance(page)
    page.get_by_test_id("maintenance-storage-door").click()
    page.get_by_test_id("storage-scene").wait_for()

def workstation_to_storage(page):
    page.get_by_test_id("back-to-maintenance").click()
    page.get_by_test_id("maintenance-room").wait_for()
    page.get_by_test_id("maintenance-storage-door").click()
    page.get_by_test_id("storage-scene").wait_for()

def storage_to_hub(page):
    page.get_by_test_id("storage-back-maintenance").click()
    page.get_by_test_id("maintenance-room").wait_for()
    page.get_by_test_id("maintenance-hub-exit").click()
    page.get_by_test_id("hub-scene").wait_for()

def hub_to_power(page):
    page.get_by_test_id("hub-engineering-door").click()
    page.get_by_test_id("power-scene").wait_for()
