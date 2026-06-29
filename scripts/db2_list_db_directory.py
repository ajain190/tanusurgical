import os
import subprocess
import sys
from pathlib import Path

HOST = "192.168.1.12"
USER = "db2ta"
PASSWORD = "db2taveda"
INSTANCE = "db2ta"
HOST_KEY = "ssh-ed25519 SHA256:CC1eNgagqfiQjblRWCbSGdnw46OkTVBh94+hPHBsp9A"


def load_env(path: Path):
    values = {}
    if not path.exists():
        return values

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def main():
    env_path = Path(__file__).with_name(".env")
    env_values = load_env(env_path)

    host = env_values.get("DB2_HOST", env_values.get("HOST", HOST))
    user = env_values.get("DB2_USER", env_values.get("USERID", USER))
    password = env_values.get("DB2_PASSWORD", env_values.get("PASSWORD", PASSWORD))
    instance = env_values.get("DB2_INSTANCE", env_values.get("INSTANCE", INSTANCE))

    remote_command = (
        f"export DB2INSTANCE={instance}; "
        f"source /home/{user}/sqllib/db2profile; "
        "db2 list db directory"
    )

    plink = r"C:\Program Files\PuTTY\plink.exe"
    cmd = [
        plink,
        "-ssh",
        "-batch",
        "-hostkey",
        HOST_KEY,
        "-P",
        "22",
        "-l",
        user,
        "-pw",
        password,
        host,
        remote_command,
    ]

    completed = subprocess.run(cmd, capture_output=True, text=True)

    if completed.stdout:
        print(completed.stdout)
    if completed.stderr:
        print(completed.stderr, file=sys.stderr)

    sys.exit(completed.returncode)


if __name__ == "__main__":
    main()
