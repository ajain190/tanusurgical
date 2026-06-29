# DB2 Python Agent

This folder contains Python-based DB2 automation scripts for remote DBA tasks.

## What it does
- Uses values from `.env` for host, user, password, and instance
- Automatically connects to the remote DB2 server via PuTTY `plink`
- Supports commands such as:
  - list databases
  - count tables in a database

## Run it
From PowerShell or any terminal in this folder:

```powershell
python .\scripts\db2_list_db_directory.py
```

## Notes
- The scripts are Python-based and require Python and PuTTY `plink.exe` on the local machine.
- The connection is non-interactive and uses the password from `.env`.
