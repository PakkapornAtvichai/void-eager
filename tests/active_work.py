"""Player-work helper for scripting an actual unfinished source check before C-17."""
def prepare_workstation_check(page, next_step="trace-issued-unit"):
    labels = {
        "trace-issued-unit": "Trace the issued unit to Storage B-04",
        "check-installation": "Look for installation verification",
        "review-completion": "Re-read the recorded completion",
    }
    page.get_by_test_id("workstation-prepare-check").click()
    page.get_by_test_id("verification-worksheet").wait_for()
    page.get_by_test_id("verification-next-choices").get_by_label(labels[next_step]).check()
    page.get_by_test_id("continue-verification").click()
    page.get_by_test_id("unfinished-verification-check").wait_for()

def second_storage_inspection(page, source="condition"):
    if source == "condition":
        page.get_by_test_id("inspect-storage-coupler").click()
    else:
        serial = "check-storage-serial" if page.get_by_test_id("check-storage-serial").count() else "storage-review-serial"
        page.get_by_test_id(serial).click()
    page.get_by_test_id("storage-detail-dialog").wait_for()
    page.get_by_test_id("close-evidence").click()
