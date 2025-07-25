#!/usr/bin/env node

/**
 * 測試 Supabase 連接和回報系統功能
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase 配置
const supabaseUrl = 'https://pcyggzipdpieiffithio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjeWdnemlwZHBpZWlmZml0aGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzU5OTksImV4cCI6MjA2Nzc1MTk5OX0.Jm3L9Z-z15W-kyWTFaArf91cGM0Wr5TyZV2gbIF3MQQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('=== 測試 Supabase 連接 ===');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Key: ${supabaseAnonKey.substring(0, 20)}...`);
    
    try {
        // 測試連接
        const { data, error } = await supabase
            .from('user_feedbacks')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('✗ 連接失敗:', error.message);
            return false;
        }
        
        console.log('✓ 成功連接到 Supabase');
        return true;
    } catch (error) {
        console.error('✗ 連接錯誤:', error);
        return false;
    }
}

async function testSubmitFeedback() {
    console.log('\n=== 測試提交回報 ===');
    
    const testData = {
        feedback_type: 'suggestion',
        title: '測試回報 - ' + new Date().toISOString(),
        content: '這是一個測試回報，用於驗證系統功能',
        contact_email: 'test@example.com',
        contact_name: '測試使用者',
        honeypot: '',
        user_agent: 'Node.js Test Script',
        referrer_url: 'http://localhost:9002'
    };
    
    try {
        // 提交回報
        const { data: feedback, error } = await supabase
            .from('user_feedbacks')
            .insert([testData])
            .select()
            .single();
            
        if (error) {
            console.error('✗ 提交失敗:', error.message);
            return null;
        }
        
        console.log('✓ 回報提交成功');
        console.log('  提交編號:', feedback.submission_id);
        console.log('  ID:', feedback.id);
        console.log('  狀態:', feedback.status);
        
        return feedback;
    } catch (error) {
        console.error('✗ 提交錯誤:', error);
        return null;
    }
}

async function testBonusCompletion(feedbackId) {
    console.log('\n=== 測試特典補完詳細資料 ===');
    
    const bonusData = {
        feedback_id: feedbackId,
        movie_title: '全知讀者視角',
        movie_english_title: 'Omniscient Reader',
        cinema_name: '威秀影城',
        bonus_type: '首週購票禮',
        bonus_name: '限定版電影小卡',
        bonus_description: '精美印刷的角色小卡，共6款隨機發放',
        acquisition_method: '購買首週場次電影票即可獲得',
        activity_period_start: '2025-02-01',
        activity_period_end: '2025-02-07',
        quantity_limit: '每人限兌1個，數量有限送完為止',
        source_type: 'facebook',
        source_url: 'https://facebook.com/example',
        source_description: '威秀影城官方Facebook貼文'
    };
    
    try {
        const { data, error } = await supabase
            .from('bonus_completion_details')
            .insert([bonusData])
            .select()
            .single();
            
        if (error) {
            console.error('✗ 特典詳細資料提交失敗:', error.message);
            return false;
        }
        
        console.log('✓ 特典詳細資料提交成功');
        console.log('  電影:', data.movie_title);
        console.log('  特典:', data.bonus_name);
        
        return true;
    } catch (error) {
        console.error('✗ 特典詳細資料錯誤:', error);
        return false;
    }
}

async function testActivityLog(feedbackId) {
    console.log('\n=== 測試活動日誌 ===');
    
    const logData = {
        feedback_id: feedbackId,
        action: 'created',
        new_value: 'pending',
        comment: 'Feedback submitted via test script'
    };
    
    try {
        const { data, error } = await supabase
            .from('feedback_activity_logs')
            .insert([logData])
            .select()
            .single();
            
        if (error) {
            console.error('✗ 活動日誌記錄失敗:', error.message);
            return false;
        }
        
        console.log('✓ 活動日誌記錄成功');
        console.log('  動作:', data.action);
        console.log('  時間:', data.created_at);
        
        return true;
    } catch (error) {
        console.error('✗ 活動日誌錯誤:', error);
        return false;
    }
}

async function testQueryFeedback(submissionId) {
    console.log('\n=== 測試查詢回報 ===');
    
    try {
        // 使用 feedback_overview 視圖查詢
        const { data, error } = await supabase
            .from('feedback_overview')
            .select('*')
            .eq('submission_id', submissionId)
            .single();
            
        if (error) {
            console.error('✗ 查詢失敗:', error.message);
            return false;
        }
        
        console.log('✓ 查詢成功');
        console.log('  標題:', data.title);
        console.log('  類型:', data.feedback_type_name);
        console.log('  狀態:', data.status);
        console.log('  提交時間:', data.created_at);
        
        return true;
    } catch (error) {
        console.error('✗ 查詢錯誤:', error);
        return false;
    }
}

async function runAllTests() {
    console.log('=== 開始測試 Supabase 回報系統 ===');
    console.log('時間:', new Date().toISOString());
    console.log('');
    
    const results = {
        connection: false,
        submitFeedback: false,
        bonusCompletion: false,
        activityLog: false,
        queryFeedback: false
    };
    
    // 1. 測試連接
    results.connection = await testConnection();
    if (!results.connection) {
        console.error('\n無法連接到 Supabase，終止測試');
        return;
    }
    
    // 2. 測試提交回報
    const feedback = await testSubmitFeedback();
    results.submitFeedback = feedback !== null;
    
    if (feedback) {
        // 3. 測試特典補完（如果是特典類型）
        results.bonusCompletion = await testBonusCompletion(feedback.id);
        
        // 4. 測試活動日誌
        results.activityLog = await testActivityLog(feedback.id);
        
        // 5. 測試查詢
        results.queryFeedback = await testQueryFeedback(feedback.submission_id);
    }
    
    // 輸出總結
    console.log('\n=== 測試總結 ===');
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    console.log(`總測試數: ${total}`);
    console.log(`通過: ${passed}`);
    console.log(`失敗: ${total - passed}`);
    console.log(`成功率: ${(passed/total * 100).toFixed(1)}%`);
    
    console.log('\n詳細結果:');
    for (const [test, result] of Object.entries(results)) {
        console.log(`  ${test}: ${result ? '✓ 通過' : '✗ 失敗'}`);
    }
    
    process.exit(passed === total ? 0 : 1);
}

// 執行測試
runAllTests().catch(console.error);