import subprocess
import datetime
import os

def run_all_reports():
    # Create logs folder if not exists
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)

    # Use one single log file
    log_file = os.path.join(log_dir, "all_runs.log")

    with open(log_file, "a", encoding="utf-8") as f:
        run_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        header = f"\n\n{'#'*80}\n🕒 Run started at: {run_time}\n{'#'*80}\n"
        print(header)
        f.write(header)

        commands = [
            ["python", "-m", "campaign_script"],
            ["python", "-m", "flows_script"],
            ["python", "-m", "campaign_value_report_script", "--timeframe", "last_7_days"],
            ["python", "-m", "campaign_value_report_script", "--timeframe", "last_30_days"],
            ["python", "-m", "flows_value_report_script", "--timeframe", "last_7_days"],
            ["python", "-m", "flows_value_report_script", "--timeframe", "last_30_days"],
        ]

        for cmd in commands:
            section_header = f"\n🚀 Running: {' '.join(cmd)}\n{'='*60}\n"
            print(section_header)
            f.write(section_header)

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.stdout:
                print(result.stdout)
                f.write(result.stdout)

            if result.stderr:
                error_text = f"⚠️ Error output:\n{result.stderr}\n"
                print(error_text)
                f.write(error_text)

            if result.returncode != 0:
                fail_text = f"❌ Command failed: {' '.join(cmd)}\n"
                print(fail_text)
                f.write(fail_text)
                break

        footer = f"\n✅ Run finished at: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        print(footer)
        f.write(footer)


if __name__ == "__main__":
    run_all_reports()
