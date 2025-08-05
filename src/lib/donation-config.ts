// Ko-fi 贊助配置
export const donationConfig = {
  kofiUsername: 'nebulab',
  displayName: 'Takuma Lee',
  // Ko-fi 嵌入設定
  useEmbeddedUI: true, // 使用嵌入式 Ko-fi UI
  kofiColor: 'hsl(var(--kofi-primary))', // Ko-fi 品牌色，使用 CSS 變數
  // 可以在這裡加入其他相關配置
  messages: {
    buttonText: '請我們喝咖啡',
    supportText: '支持特典速報',
    thankYouMessage: '感謝您的支持！',
  },
  // 控制按鈕顯示
  showHeaderButton: true,
  showFloatingButton: false, // 預設關閉浮動按鈕，避免太多按鈕
  showFooterLink: true,
  // Ko-fi 浮動小工具（全站顯示）
  showKofiFloatingWidget: false, // 可選：顯示 Ko-fi 官方浮動按鈕
};