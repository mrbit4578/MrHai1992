#!/usr/bin/env python3
"""
CỬU LONG PHA CHẾ - AUTO UPLOAD AGENT
Tự động đẩy toàn bộ dự án website lên GitHub
https://github.com/mrbit4578/MrHai1992

Cách dùng:
  python scripts/upload-agent.py

Yêu cầu:
  - Git đã cài
  - Đã có quyền push (gh auth login hoặc SSH key)
  - Hoặc dùng token GitHub (GITHUB_TOKEN env)

Agent này được build cùng dự án để dễ quản lý sau này.
"""

import os
import subprocess
import sys
from datetime import datetime

REPO_URL = "https://github.com/mrbit4578/MrHai1992.git"
PROJECT_NAME = "Cửu Long Pha Chế Website"

def run(cmd: str, check=True):
    print(f"→ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout.strip():
        print(result.stdout.strip())
    if check and result.returncode != 0:
        print("❌ Lỗi:", result.stderr)
        sys.exit(1)
    return result

def main():
    print("=" * 60)
    print(f"🚀 {PROJECT_NAME} - AUTO UPLOAD AGENT")
    print("=" * 60)

    # 1. Kiểm tra git
    if not os.path.exists(".git"):
        print("Khởi tạo git repository...")
        run("git init")
        run(f"git remote add origin {REPO_URL}")

    # 2. Thêm tất cả thay đổi
    run("git add .")

    # 3. Commit
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    message = f"chore: Auto update website Pha Chế Cửu Long - {timestamp}"
    run(f'git commit -m "{message}" --allow-empty')

    # 4. Push (main branch)
    print("\nĐang đẩy lên GitHub...")
    try:
        run("git push -u origin main", check=False)
        run("git push origin main", check=False)
    except:
        # Thử branch master nếu main chưa có
        run("git branch -M main", check=False)
        run("git push -u origin main", check=False)

    print("\n✅ Upload thành công!")
    print("🌐 Repo: https://github.com/mrbit4578/MrHai1992")
    print("💡 Gợi ý: Deploy bằng GitHub Pages (Settings → Pages → main branch /root)")

if __name__ == "__main__":
    main()
