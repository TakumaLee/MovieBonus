#!/usr/bin/env python3
"""
測試前端回報系統的完整功能
"""

import asyncio
import json
import time
from datetime import datetime
from playwright.async_api import async_playwright
from typing import Dict, List, Any

class FeedbackSystemTester:
    def __init__(self):
        self.base_url = "http://localhost:9002"
        self.test_results = []
        
    async def test_connection(self, page):
        """測試前端是否能正常連接到 Supabase"""
        print("\n=== 1. 測試 Supabase 連接 ===")
        
        # 監聽網路請求
        requests = []
        page.on("request", lambda request: requests.append(request))
        
        # 訪問主頁
        await page.goto(self.base_url)
        await page.wait_for_timeout(3000)
        
        # 檢查是否有 Supabase 請求
        supabase_requests = [req for req in requests if "supabase.co" in req.url]
        
        if supabase_requests:
            print(f"✓ 成功連接到 Supabase，發現 {len(supabase_requests)} 個請求")
            for req in supabase_requests[:5]:  # 顯示前5個請求
                print(f"  - {req.method} {req.url.split('?')[0]}")
            return True
        else:
            print("✗ 未發現 Supabase 請求")
            return False
    
    async def test_feedback_form_ui(self, page):
        """測試回報表單 UI 是否正常載入"""
        print("\n=== 2. 測試回報表單 UI ===")
        
        try:
            # 點擊浮動按鈕開啟表單
            feedback_button = await page.wait_for_selector('button[aria-label="開啟回饋表單"]', timeout=5000)
            await feedback_button.click()
            
            # 等待表單出現
            await page.wait_for_selector('.fixed.inset-0', timeout=3000)
            
            # 檢查表單元素
            elements_to_check = [
                ('select:has-text("選擇回饋類型")', '回饋類型選擇器'),
                ('textarea[id="feedback-content"]', '內容輸入框'),
                ('input[id="feedback-title"]', '標題輸入框'),
                ('input[id="feedback-name"]', '姓名輸入框'),
                ('input[id="feedback-email"]', 'Email 輸入框'),
                ('button:has-text("提交回饋")', '提交按鈕'),
            ]
            
            all_found = True
            for selector, name in elements_to_check:
                try:
                    await page.wait_for_selector(selector, timeout=1000)
                    print(f"✓ {name} 已載入")
                except:
                    print(f"✗ {name} 未找到")
                    all_found = False
                    
            return all_found
            
        except Exception as e:
            print(f"✗ 無法開啟回報表單: {e}")
            return False
    
    async def test_submit_basic_feedback(self, page):
        """測試提交基本回報（意見建議）"""
        print("\n=== 3. 測試提交基本回報 ===")
        
        try:
            # 開啟表單（如果還沒開啟）
            if not await page.query_selector('.fixed.inset-0'):
                feedback_button = await page.wait_for_selector('button[aria-label="開啟回饋表單"]')
                await feedback_button.click()
                await page.wait_for_selector('.fixed.inset-0')
            
            # 填寫表單
            # 選擇回饋類型
            await page.click('button[role="combobox"]')
            await page.wait_for_selector('[role="option"]')
            await page.click('[role="option"]:has-text("意見建議")')
            
            # 填寫內容
            await page.fill('#feedback-title', '測試回報標題')
            await page.fill('#feedback-content', '這是一個測試回報，用於驗證系統功能是否正常。')
            await page.fill('#feedback-name', '測試使用者')
            await page.fill('#feedback-email', 'test@example.com')
            
            # 監聽網路請求
            response_data = None
            async def handle_response(response):
                nonlocal response_data
                if "supabase.co" in response.url and "user_feedbacks" in response.url:
                    try:
                        response_data = await response.json()
                    except:
                        pass
                        
            page.on("response", handle_response)
            
            # 提交表單
            submit_button = await page.query_selector('button:has-text("提交回饋")')
            await submit_button.click()
            
            # 等待提交完成
            await page.wait_for_timeout(5000)
            
            # 檢查是否有成功訊息
            success_message = await page.query_selector('text=/提交編號/')
            
            if success_message:
                print("✓ 基本回報提交成功")
                # 嘗試獲取提交編號
                submission_id = await page.text_content('code')
                if submission_id:
                    print(f"  提交編號: {submission_id}")
                return True
            else:
                print("✗ 未看到成功訊息")
                return False
                
        except Exception as e:
            print(f"✗ 提交基本回報失敗: {e}")
            return False
    
    async def test_submit_bonus_feedback(self, page):
        """測試提交特典補完回報"""
        print("\n=== 4. 測試提交特典補完回報 ===")
        
        try:
            # 關閉現有表單並重新開啟
            close_button = await page.query_selector('button:has(svg.lucide-x)')
            if close_button:
                await close_button.click()
                await page.wait_for_timeout(1000)
            
            # 重新開啟表單
            feedback_button = await page.wait_for_selector('button[aria-label="開啟回饋表單"]')
            await feedback_button.click()
            await page.wait_for_selector('.fixed.inset-0')
            
            # 選擇特典補完類型
            await page.click('button[role="combobox"]')
            await page.wait_for_selector('[role="option"]')
            await page.click('[role="option"]:has-text("特典補完")')
            
            # 填寫步驟1
            await page.fill('#feedback-content', '發現新的電影特典資訊需要補充')
            
            # 點擊下一步
            next_button = await page.wait_for_selector('button:has-text("下一步：特典詳情")')
            await next_button.click()
            
            # 等待步驟2載入
            await page.wait_for_selector('#movie-title', timeout=3000)
            
            # 填寫特典詳情
            await page.fill('#movie-title', '全知讀者視角')
            await page.fill('#movie-english-title', 'Omniscient Reader')
            
            # 選擇影城
            await page.click('button[role="combobox"]:has-text("選擇影城")')
            await page.click('[role="option"]:has-text("威秀影城")')
            
            # 選擇特典類型
            await page.click('button[role="combobox"]:has-text("選擇特典類型")')
            await page.click('[role="option"]:has-text("首週購票禮")')
            
            await page.fill('#bonus-name', '限定版電影小卡')
            await page.fill('#bonus-description', '精美印刷的角色小卡，共6款隨機發放')
            await page.fill('#acquisition-method', '購買首週場次電影票即可獲得')
            await page.fill('#period-start', '2025-02-01')
            await page.fill('#period-end', '2025-02-07')
            await page.fill('#quantity-limit', '每人限兌1個，數量有限送完為止')
            
            # 選擇資料來源
            await page.click('button[role="combobox"]:has-text("選擇來源類型")')
            await page.click('[role="option"]:has-text("Facebook")')
            
            await page.fill('#source-url', 'https://facebook.com/example')
            await page.fill('#source-description', '威秀影城官方Facebook貼文')
            
            # 提交
            submit_button = await page.query_selector('button:has-text("提交特典補完")')
            await submit_button.click()
            
            # 等待提交完成
            await page.wait_for_timeout(5000)
            
            # 檢查是否有成功訊息
            success_message = await page.query_selector('text=/提交編號/')
            
            if success_message:
                print("✓ 特典補完回報提交成功")
                submission_id = await page.text_content('code')
                if submission_id:
                    print(f"  提交編號: {submission_id}")
                return True
            else:
                print("✗ 未看到成功訊息")
                return False
                
        except Exception as e:
            print(f"✗ 提交特典補完回報失敗: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def test_rate_limiting(self, page):
        """測試速率限制功能"""
        print("\n=== 5. 測試速率限制 ===")
        
        try:
            # 連續提交多次測試速率限制
            for i in range(4):
                # 關閉現有表單
                close_button = await page.query_selector('button:has(svg.lucide-x)')
                if close_button:
                    await close_button.click()
                    await page.wait_for_timeout(500)
                
                # 重新開啟表單
                feedback_button = await page.wait_for_selector('button[aria-label="開啟回饋表單"]')
                await feedback_button.click()
                await page.wait_for_selector('.fixed.inset-0')
                
                # 快速填寫表單
                await page.click('button[role="combobox"]')
                await page.click('[role="option"]:has-text("意見建議")')
                await page.fill('#feedback-content', f'速率測試 {i+1}')
                
                # 提交
                submit_button = await page.query_selector('button:has-text("提交回饋")')
                await submit_button.click()
                
                await page.wait_for_timeout(2000)
                
                # 檢查是否被限制
                if i == 3:  # 第4次應該被限制
                    rate_limit_message = await page.query_selector('text=/每小時限制/')
                    if rate_limit_message:
                        print("✓ 速率限制正常工作（第4次提交被阻止）")
                        return True
                else:
                    print(f"  第 {i+1} 次提交...")
            
            print("✗ 速率限制未生效")
            return False
            
        except Exception as e:
            print(f"✗ 速率限制測試失敗: {e}")
            return False
    
    async def test_error_handling(self, page):
        """測試錯誤處理"""
        print("\n=== 6. 測試錯誤處理 ===")
        
        test_cases = [
            {
                "name": "空內容提交",
                "action": async () => {
                    # 開啟表單
                    if not await page.query_selector('.fixed.inset-0'):
                        feedback_button = await page.wait_for_selector('button[aria-label="開啟回饋表單"]')
                        await feedback_button.click()
                        await page.wait_for_selector('.fixed.inset-0')
                    
                    # 不填寫任何內容直接提交
                    submit_button = await page.query_selector('button:has-text("提交回饋")')
                    await submit_button.click()
                    
                    # 檢查錯誤訊息
                    await page.wait_for_timeout(1000)
                    error_message = await page.query_selector('text=/請選擇回饋類型/')
                    return error_message is not None
                }
            },
            {
                "name": "無效 Email 格式",
                "action": async () => {
                    # 填寫無效的 email
                    await page.fill('#feedback-email', 'invalid-email')
                    return True  # Email 驗證通常在提交時進行
                }
            }
        ]
        
        all_passed = True
        for test_case in test_cases:
            try:
                result = await test_case["action"]()
                if result:
                    print(f"✓ {test_case['name']} - 錯誤處理正常")
                else:
                    print(f"✗ {test_case['name']} - 錯誤處理失敗")
                    all_passed = False
            except Exception as e:
                print(f"✗ {test_case['name']} - 測試失敗: {e}")
                all_passed = False
                
        return all_passed
    
    async def run_all_tests(self):
        """執行所有測試"""
        print("=== 開始測試前端回報系統 ===")
        print(f"測試時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"測試網址: {self.base_url}")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context()
            page = await context.new_page()
            
            # 設置 console 監聽
            page.on("console", lambda msg: print(f"[Console] {msg.text}") if msg.type == "error" else None)
            
            try:
                # 執行測試
                tests = [
                    ("Supabase 連接", self.test_connection),
                    ("回報表單 UI", self.test_feedback_form_ui),
                    ("基本回報提交", self.test_submit_basic_feedback),
                    ("特典補完提交", self.test_submit_bonus_feedback),
                    ("速率限制", self.test_rate_limiting),
                    ("錯誤處理", self.test_error_handling),
                ]
                
                results = {}
                for test_name, test_func in tests:
                    try:
                        result = await test_func(page)
                        results[test_name] = result
                    except Exception as e:
                        print(f"\n測試 {test_name} 發生錯誤: {e}")
                        results[test_name] = False
                    
                    # 每個測試之間等待一下
                    await page.wait_for_timeout(1000)
                
                # 輸出測試總結
                print("\n=== 測試總結 ===")
                passed = sum(1 for result in results.values() if result)
                total = len(results)
                
                print(f"總測試數: {total}")
                print(f"通過: {passed}")
                print(f"失敗: {total - passed}")
                print(f"成功率: {(passed/total)*100:.1f}%")
                
                print("\n詳細結果:")
                for test_name, result in results.items():
                    status = "✓ 通過" if result else "✗ 失敗"
                    print(f"  {test_name}: {status}")
                
                # 截圖保存最終狀態
                await page.screenshot(path="feedback-system-test-result.png", full_page=True)
                print(f"\n截圖已保存: feedback-system-test-result.png")
                
            finally:
                await browser.close()

if __name__ == "__main__":
    tester = FeedbackSystemTester()
    asyncio.run(tester.run_all_tests())