import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import {
  LayoutDashboard, ClipboardList, FileStack, Users, Package, Receipt,
  UploadCloud, CheckCircle2, XCircle, Clock, ChevronRight, ChevronLeft, LogOut,
  Plus, Search, Edit3, Trash2, ArrowLeft, Stamp, Building2, Wallet,
  ShieldCheck, AlertTriangle, TrendingUp, FileCheck2, Inbox,
  Lock, Fingerprint, Loader2, Eye, EyeOff, MessageCircle, Truck, MapPin, Phone, FileText, FolderOpen, RefreshCw
} from 'lucide-react';

/* ============================== 视觉token ============================== */
const C = {
  ink: '#232420',
  paper: '#EAE5DA',
  surface: '#FFFFFF',
  wood: '#9C4A24',
  woodLight: '#C1743F',
  woodTint: '#F1E3D6',
  teal: '#2B6459',
  tealTint: '#E1EBE8',
  ochre: '#B5822A',
  ochreTint: '#F3E9D6',
  brick: '#A63B32',
  brickTint: '#F3E0DD',
  line: '#D8D0C0',
  sub: '#6B6558',
};

const fontDisplay = "'Fraunces', serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

/* ============================== 语言 i18n ============================== */
const STRINGS = {
  appName: { zh: '门店营运台', en: 'Store Ops Console' },
  chooseRole: { zh: '选择你的角色以继续', en: 'Choose your role to continue' },
  imA: { zh: '我是……', en: 'I am…' },
  back: { zh: '返回', en: 'Back' },
  switchRole: { zh: '切换角色', en: 'Switch role' },
  role_salesman: { zh: 'Salesman', en: 'Salesman' },
  role_salesman_sub: { zh: '销售员', en: 'Salesman' },
  role_salesman_desc: { zh: '填写订单、申请佣金、查看团队业绩', en: 'Submit orders, claim commission, view team results' },
  role_leader: { zh: 'Sales Team Leader', en: 'Sales Team Leader' },
  role_leader_sub: { zh: '销售团队主管', en: 'Sales Team Leader' },
  role_leader_desc: { zh: '查看团队业绩与佣金核销进度', en: 'View team results and commission status' },
  role_admin: { zh: 'Admin', en: 'Admin' },
  role_admin_sub: { zh: '开 SO 管理员', en: 'SO Admin' },
  role_admin_desc: { zh: '审核订单、开立 SO', en: 'Review orders, issue SO' },
  role_finance: { zh: 'Finance', en: 'Finance' },
  role_finance_sub: { zh: '财务', en: 'Finance' },
  role_finance_desc: { zh: '核实佣金、管理商品资料', en: 'Verify commissions, manage product catalog' },
  password: { zh: '输入密码', en: 'Enter password' },
  login: { zh: '登入', en: 'Log In' },
  useFaceId: { zh: '改用 Face ID 登入', en: 'Use Face ID instead' },
  usePassword: { zh: '改用密码登入', en: 'Use password instead' },
  faceIdScanning: { zh: '正在核对 Face ID……', en: 'Verifying Face ID…' },
  faceIdTap: { zh: '点击圆圈以模拟 Face ID 扫描', en: 'Tap the circle to simulate Face ID scan' },
  wrongPassword: { zh: '密码不正确，请重试。', en: 'Incorrect password, please try again.' },
  nav_dashboard: { zh: '仪表板', en: 'Dashboard' },
  nav_team_overview: { zh: '团队总览', en: 'Team Overview' },
  nav_pending_so: { zh: '待开 SO', en: 'Pending SO' },
  nav_finance_console: { zh: '财务管理台', en: 'Finance Console' },
  cancel: { zh: '取消', en: 'Cancel' },
  save: { zh: '保存', en: 'Save' },
  confirm: { zh: '确认', en: 'Confirm' },
  detail: { zh: '详情', en: 'Details' },
  collapse: { zh: '收起', en: 'Collapse' },
  submit: { zh: '提交', en: 'Submit' },
  edit: { zh: '编辑', en: 'Edit' },
  delete: { zh: '删除', en: 'Delete' },
  add: { zh: '新增', en: 'Add' },
  next: { zh: '下一步', en: 'Next' },
  prev: { zh: '上一步', en: 'Previous' },
  welcomeBack: { zh: '欢迎回来', en: 'Welcome back' },
  claimCommission: { zh: '申请佣金', en: 'Claim Commission' },
  newOrder: { zh: '新增订单', en: 'New Order' },
  statTeamTotal: { zh: '团队本月业绩（已开SO）', en: 'Team Total This Month (SO Issued)' },
  statMyOrders: { zh: '我的订单', en: 'My Orders' },
  statPendingSoCount: { zh: '笔待开SO', en: 'pending SO' },
  statMyClaims: { zh: '我的佣金申请', en: 'My Commission Claims' },
  view: { zh: '查看', en: 'View' },
  clickToStart: { zh: '点击「申请佣金」开始', en: 'Click "Claim Commission" to start' },
  teamResultTitle: { zh: '团队本月业绩（全员可见）', en: 'Team Results This Month (visible to all)' },
  myOrdersTitle: { zh: '我的订单记录', en: 'My Order Records' },
  editResubmit: { zh: '编辑并重新提交', en: 'Edit & Resubmit' },
  changeModel: { zh: '换款', en: 'Change Model' },
  orderFormEyebrow: { zh: 'Order Form', en: 'Order Form' },
  newOrderTitle: { zh: '填写新订单', en: 'New Order Form' },
  editResubmitTitle: { zh: '编辑订单并重新提交', en: 'Edit Order & Resubmit' },
  changeModelTitle: { zh: '换款并重新提交审核', en: 'Change Model & Resubmit' },
  rejectReasonNotice: { zh: 'Admin 上次拒绝开 SO 的原因', en: 'Admin\u2019s reason for rejecting SO last time' },
  changeModelNotice: { zh: '这笔订单原本的 SO 编号 {so} 将会失效，修改商品后需要 Admin 重新审核并开立新的 SO。', en: 'This order\u2019s original SO {so} will be voided. Once you change the product, Admin will need to review and issue a new SO.' },
  backToDashboard: { zh: '返回仪表板', en: 'Back to dashboard' },
  incompleteInfo: { zh: '信息未完整', en: 'Incomplete information' },
  customerInfo: { zh: '客户资料 Customer Info', en: 'Customer Info' },
  fullName: { zh: 'Full Name', en: 'Full Name' },
  alamat: { zh: 'Alamat（地址）', en: 'Alamat (Address)' },
  poscodeLabel: { zh: 'Poscode（5位数字，50000–89990）', en: 'Poscode (5 digits, 50000–89990)' },
  phone1: { zh: 'No Phone 1', en: 'No Phone 1' },
  phone2: { zh: 'No Phone 2（选填）', en: 'No Phone 2 (optional)' },
  salesInfo: { zh: '销售资料 Sales Info', en: 'Sales Info' },
  salesExecutive: { zh: 'Sales Executive', en: 'Sales Executive' },
  salesmanPhone: { zh: 'Salesman Phone Number', en: 'Salesman Phone Number' },
  itemSection: { zh: '商品 Item', en: 'Item' },
  chooseModel: { zh: '选择型号 Model', en: 'Select Model' },
  qty: { zh: '数量', en: 'Qty' },
  addAnotherItem: { zh: '再加一项商品', en: 'Add another item' },
  amountLabel: { zh: 'Amount（RM，可手动调整）', en: 'Amount (RM, adjustable)' },
  itemsTotalNote: { zh: '商品总额（含加购项）', en: 'Items total (incl. add-ons)' },
  resetToItemsTotal: { zh: '重置为商品总额', en: 'Reset to items total' },
  depositSection: { zh: '客户有给订金 Deposit Collected', en: 'Deposit Collected' },
  depositHint: { zh: '（不是所有商品都需要订金，有才勾选）', en: '(Not all items need a deposit — tick only if collected)' },
  depositAmountLabel: { zh: '订金金额 Deposit Amount (RM)', en: 'Deposit Amount (RM)' },
  depositSlipLabel: { zh: '上传订金水单 Deposit Slip（必填）', en: 'Upload Deposit Slip (required)' },
  depositSlipRequired: { zh: '已勾选有订金，须上传订金水单才能提交订单', en: 'Deposit collected \u2014 please upload the deposit slip before submitting' },
  uploadClickHere: { zh: '点击上传（图片/PDF）', en: 'Click to upload (image/PDF)' },
  deliveryCheckbox: { zh: '客户要求 7 天内送货（Delivery within 7 days）', en: 'Customer needs delivery within 7 days' },
  logisticNote: { zh: '须上传物流批准的 WhatsApp 对话截图', en: 'Upload the WhatsApp screenshot for logistics approval' },
  clickToSelectScreenshot: { zh: '点击选择截图', en: 'Click to choose screenshot' },
  remarkLabel: { zh: 'Remark（选填）', en: 'Remark (optional)' },
  remarkPlaceholder: { zh: '其他备注事项', en: 'Any other notes' },
  submitToAdmin: { zh: '提交给 Admin 审核开 SO', en: 'Submit to Admin for SO review' },
  resubmitToAdmin: { zh: '重新提交给 Admin 审核', en: 'Resubmit to Admin for review' },
  soFileCol: { zh: 'SO 文件', en: 'SO File' },
  orderIdCol: { zh: '订单编号', en: 'Order ID' },
  customerCol: { zh: '客户', en: 'Customer' },
  agentCol: { zh: '销售员', en: 'Salesman' },
  poscodeCol: { zh: 'POS Code', en: 'POS Code' },
  itemsCol: { zh: '品项', en: 'Items' },
  amountCol: { zh: '金额', en: 'Amount' },
  statusCol: { zh: '状态', en: 'Status' },
  noRecords: { zh: '暂无记录', en: 'No records yet' },
  status_pending_so: { zh: '待开 SO', en: 'Pending SO' },
  status_so_opened: { zh: 'SO 已开', en: 'SO Issued' },
  status_so_rejected: { zh: '开 SO 已拒绝', en: 'SO Rejected' },
  status_pending: { zh: '待审核', en: 'Pending' },
  status_verified: { zh: '已核实', en: 'Verified' },
  status_rejected: { zh: '已拒绝', en: 'Rejected' },
  teamLeaderOverview: { zh: '团队总览', en: 'Team Overview' },
  statVerifiedTotal: { zh: '已核实佣金合计', en: 'Total Verified Commission' },
  statPendingTotal: { zh: '待审核佣金合计', en: 'Total Pending Commission' },
  teamResultDistribution: { zh: '团队业绩分布', en: 'Team Sales Distribution' },
  commissionBreakdown: { zh: '各销售员佣金核销状况', en: 'Commission Status by Salesman' },
  colClaimed: { zh: '已核实（Claimed）', en: 'Verified (Claimed)' },
  colPending: { zh: '待审核（Pending）', en: 'Pending' },
  colRejectedCount: { zh: '已拒绝笔数（Rejected）', en: 'Rejected Count' },
  teamOrdersTitle: { zh: '团队订单记录', en: 'Team Order Records' },
  adminEyebrow: { zh: 'Admin', en: 'Admin' },
  pendingSoOrders: { zh: '待开 SO 订单', en: 'Orders Pending SO' },
  tabOrderReview: { zh: '订单审核', en: 'Order Review' },
  tabItemsManage: { zh: '商品管理', en: 'Product Catalog' },
  statPendingSo: { zh: '待开 SO', en: 'Pending SO' },
  statSoThisMonth: { zh: '本月已开 SO', en: 'SO Issued This Month' },
  statPendingLogistics: { zh: '待批准物流（7天内送货）', en: 'Pending Logistics (7-day delivery)' },
  noPendingSo: { zh: '暂无待开 SO 订单', en: 'No orders pending SO' },
  openSo: { zh: '开 SO', en: 'Issue SO' },
  reject: { zh: '拒绝', en: 'Reject' },
  soNumberLabel: { zh: 'SO 编号', en: 'SO Number' },
  uploadSoPdf: { zh: '上传 SO PDF', en: 'Upload SO PDF' },
  chooseSoPdf: { zh: '选择 PDF 文件…', en: 'Choose PDF file…' },
  confirmOpenSo: { zh: '确认开 SO', en: 'Confirm Issue SO' },
  soPdfRequiredNote: { zh: 'SO 是 PDF 版本，须上传 PDF 文件才能确认开 SO', en: 'SO is a PDF document \u2014 please upload the PDF before confirming' },
  rejectReasonPrompt: { zh: '拒绝开 SO 原因（销售员将会看到）', en: 'Reason for rejecting SO (visible to the salesman)' },
  rejectReasonPlaceholder: { zh: '例：客户资料不完整 / POS Code 有误，请核实后重新提交', en: 'e.g. Incomplete customer info / wrong POS Code, please correct and resubmit' },
  confirmReject: { zh: '确认拒绝', en: 'Confirm Reject' },
  archivedOrders: { zh: '已归档订单', en: 'Archived Orders' },
  rejectedSection: { zh: 'Rejected', en: 'Rejected' },
  rejectedOrdersTitle: { zh: '已拒绝开 SO 的订单', en: 'Orders with SO Rejected' },
  rejectReasonCol: { zh: '拒绝原因', en: 'Reject Reason' },
  reopenReview: { zh: '重新开放审核', en: 'Reopen for Review' },
  orderDetailsTitle: { zh: '订单详情 Order Details', en: 'Order Details' },
  submittedBy: { zh: '提交销售员：', en: 'Submitted by:' },
  salesmanPhoneLabel: { zh: '销售员电话：', en: 'Salesman phone:' },
  itemsLabel: { zh: '商品：', en: 'Items:' },
  orderTotalLabel: { zh: '订单总额 Amount：', en: 'Order Total:' },
  depositLabel: { zh: '订金 Deposit：', en: 'Deposit:' },
  depositAmountUnfilled: { zh: '金额未填', en: 'amount not entered' },
  soNumberColon: { zh: 'SO 编号：', en: 'SO Number:' },
  soNotIssuedYet: { zh: '尚未开出', en: 'not issued yet' },
  viewSoPdf: { zh: '查看 SO PDF', en: 'View SO PDF' },
  remarkColon: { zh: '备注 Remark：', en: 'Remark:' },
  rejectReasonColon: { zh: '拒绝开SO原因：', en: 'SO reject reason:' },
  changeModelResubmit: { zh: '换款重新提交：原 SO 编号 {so} 已失效，需开立新 SO', en: 'Model changed & resubmitted: original SO {so} voided, new SO required' },
  changeModelTag: { zh: '换款重提', en: 'Model Changed' },
  depositApproval: { zh: '订金 Deposit', en: 'Deposit' },
  noFilePreview: { zh: '无档名', en: 'no file name' },
  amountUnfilled: { zh: '金额未填', en: 'amount not entered' },
  deliveryApprovalTitle: { zh: '7天内送货 · 物流批准', en: '7-Day Delivery \u00b7 Logistics Approval' },
  openFile: { zh: '打开文件', en: 'Open file' },
  noScreenshotPreview: { zh: '无截图预览', en: 'no screenshot preview' },
  approve: { zh: '批准', en: 'Approve' },
  financeEyebrow: { zh: 'Finance', en: 'Finance' },
  financeConsoleTitle: { zh: '财务管理台', en: 'Finance Console' },
  tabCommission: { zh: '佣金核实', en: 'Commission Review' },
  tabTeamSales: { zh: '团队业绩', en: 'Team Sales' },
  filterAll: { zh: '全部', en: 'All' },
  filterPending: { zh: '待审核', en: 'Pending' },
  filterVerified: { zh: '已核实', en: 'Verified' },
  filterRejected: { zh: '已拒绝', en: 'Rejected' },
  colClaimId: { zh: '申请编号', en: 'Claim ID' },
  colOrder: { zh: '订单', en: 'Order' },
  colPaymentMethod: { zh: '付款方式', en: 'Payment Method' },
  colSlipCheck: { zh: '水单核对', en: 'Slip Check' },
  colDriveFile: { zh: 'Drive 档案', en: 'Drive File' },
  colClaimAmount: { zh: '申请金额', en: 'Claim Amount' },
  payeeConfirmed: { zh: '已确认收款方', en: 'Payee confirmed' },
  payeeMismatch: { zh: '收款方不符', en: 'Payee mismatch' },
  verify: { zh: '核实', en: 'Verify' },
  bankSlipTitle: { zh: '付款水单 Bank Slip', en: 'Bank Slip' },
  depositSlipTitle: { zh: '订金水单 Deposit Slip', en: 'Deposit Slip' },
  noPreview: { zh: '无预览', en: 'No preview' },
  totalCheckDeposit: { zh: '订金 Deposit', en: 'Deposit' },
  totalCheckSlip: { zh: '水单 Bank Slip', en: 'Bank Slip' },
  totalCheckReceived: { zh: '合计 Total Received', en: 'Total Received' },
  totalCheckOrderTotal: { zh: '订单总额 Order Total', en: 'Order Total' },
  orderNotFound: { zh: '找不到对应订单记录', en: 'Order record not found' },
  teamSalesCount: { zh: '笔已开 SO 订单', en: 'SO-issued orders' },
  itemsManageAddNew: { zh: '新增商品', en: 'Add Product' },
  colImage: { zh: '图片', en: 'Image' },
  colCode: { zh: '编号', en: 'Code' },
  colProduct: { zh: '商品', en: 'Product' },
  colPrice: { zh: '价格', en: 'Price' },
  colStock: { zh: '库存', en: 'Stock' },
  colColor: { zh: '颜色', en: 'Color' },
  productImage: { zh: '商品图片', en: 'Product Image' },
  uploadImage: { zh: '上传图片', en: 'Upload image' },
  codeLabel: { zh: '编号 Code', en: 'Code' },
  productNameLabel: { zh: '商品名称', en: 'Product Name' },
  categoryLabel: { zh: '分类 Category', en: 'Category' },
  chooseCategory: { zh: '— 选择分类 —', en: '— Select Category —' },
  priceLabel: { zh: '价格 Price (RM)', en: 'Price (RM)' },
  stockLabel: { zh: '库存 Stock', en: 'Stock' },
  colorLabel: { zh: '颜色 Color', en: 'Color' },
  addOnSection: { zh: '加购项 Add-on（下单时销售员可勾选）', en: 'Add-ons (selectable when ordering)' },
  addOnNameCol: { zh: '加购项名称', en: 'Add-on Name' },
  addOnStockCol: { zh: '库存 Stock', en: 'Stock' },
  addOnPriceCol: { zh: '价格 Price', en: 'Price' },
  noAddOns: { zh: '暂无加购项', en: 'No add-ons yet' },
  addNewAddOn: { zh: '新增加购项', en: 'Add new add-on' },
  claimWizardEyebrow: { zh: 'Claim Commission', en: 'Claim Commission' },
  claimWizardTitle: { zh: '申请佣金', en: 'Claim Commission' },
  step1: { zh: '选择订单', en: 'Select Order' },
  step2: { zh: '付款方式', en: 'Payment Method' },
  step3: { zh: '上传水单', en: 'Upload Slip' },
  step4: { zh: '核对金额', en: 'Verify Amount' },
  chooseOrderHint: { zh: '在「ORDER」记录里选择要申请佣金的订单（仅显示已开 SO 的订单）', en: 'Pick the order to claim commission for (only SO-issued orders shown)' },
  noEligibleOrders: { zh: '暂无可申请的订单。', en: 'No eligible orders yet.' },
  paymentMethodLabel: { zh: '客户付款方式', en: 'Customer Payment Method' },
  uploadSlipLabel: { zh: '上传付款水单 Slip', en: 'Upload Payment Slip' },
  clickToChooseFile: { zh: '点击选择图片 / PDF', en: 'Click to choose image / PDF' },
  slipVerifiedNote: { zh: '系统已自动识别水单收款户名为 EE LIFE DESIGN SDN. BHD.，核对通过。', en: 'System auto-detected payee as EE LIFE DESIGN SDN. BHD. \u2014 verified.' },
  slipVerifiedSub: { zh: '（原型模拟识别结果，正式版将串接 OCR / 银行对账 API）', en: '(Simulated result \u2014 production will integrate OCR / bank reconciliation API)' },
  driveSyncedNote: { zh: '已自动同步至 Google Drive 文件夹 {folder}，档名已存为 {file}，方便日后以 SO 编号找回。', en: 'Auto-synced to Google Drive folder {folder}, saved as {file} for easy retrieval by SO number.' },
  driveSyncedSub: { zh: '（原型模拟同步结果，正式版将串接 Google Drive API 自动上传）', en: '(Simulated sync \u2014 production will integrate the Google Drive API)' },
  reviewAmountHint: { zh: '系统已从水单提取金额，可手动核对／调整：', en: 'Amount extracted from the slip \u2014 you can review/adjust it:' },
  paymentAmountLabel: { zh: '水单金额 Payment Amount (RM)', en: 'Payment Amount (RM)' },
  paymentAmountRow: { zh: '水单金额 Payment Amount', en: 'Payment Amount' },
  orderTotalRow: { zh: '订单总额 Order Total Amount', en: 'Order Total Amount' },
  commissionHiddenNote: { zh: '佣金金额将由财务核实后核算，此处不显示。', en: 'The commission amount will be calculated by Finance after verification, and is not shown here.' },
  submitToFinance: { zh: '提交给财务核实', en: 'Submit to Finance for Verification' },
  tabAccounts: { zh: '账号管理', en: 'Account Management' },
  accountsIntro: { zh: '只有 Finance 能新增/删除账号，其他角色只能登入后修改自己的密码，不能自行注册。', en: 'Only Finance can create or delete accounts. Other roles can only log in and change their own password \u2014 no self-registration.' },
  createAccount: { zh: '新增账号', en: 'Create Account' },
  accountRole: { zh: '角色 Role', en: 'Role' },
  accountName: { zh: '姓名 Name', en: 'Name' },
  accountTeam: { zh: '所属团队 Team', en: 'Team' },
  accountPassword: { zh: '初始密码 Initial Password', en: 'Initial Password' },
  chooseSalesman: { zh: '— 选择销售员 —', en: '— Select Salesman —' },
  chooseTeam: { zh: '— 选择团队 —', en: '— Select Team —' },
  noAvailableSalesman: { zh: '目前团队成员都已经有账号', en: 'All team members already have accounts' },
  noAvailableTeam: { zh: '所有团队都已经有主管账号', en: 'All teams already have a leader account' },
  create: { zh: '创建', en: 'Create' },
  resetPassword: { zh: '重设密码', en: 'Reset Password' },
  newPassword: { zh: '新密码', en: 'New Password' },
  accountsListTitle: { zh: '现有账号', en: 'Existing Accounts' },
  colRole: { zh: '角色', en: 'Role' },
  colNameTeam: { zh: '姓名／团队', en: 'Name / Team' },
  colPassword: { zh: '密码', en: 'Password' },
  noAccountsYet: { zh: '尚未新增任何账号', en: 'No accounts created yet' },
  changePassword: { zh: '修改密码', en: 'Change Password' },
  currentPassword: { zh: '目前密码', en: 'Current Password' },
  confirmNewPassword: { zh: '确认新密码', en: 'Confirm New Password' },
  passwordUpdated: { zh: '密码已更新', en: 'Password updated' },
  currentPasswordWrong: { zh: '目前密码不正确', en: 'Current password is incorrect' },
  passwordMismatch: { zh: '两次输入的新密码不一致', en: 'New passwords do not match' },
  passwordTooShort: { zh: '密码至少要 6 个字符', en: 'Password must be at least 6 characters' },
  forgotPasswordNote: { zh: '忘记密码？请联系 Finance 重设。', en: 'Forgot your password? Ask Finance to reset it.' },
  contactSalesExec: { zh: '姓名', en: 'Name' },
  changeBtn: { zh: '更换', en: 'Change' },
  noMatchingProduct: { zh: '找不到符合的商品', en: 'No matching product found' },
  addOnSectionPlain: { zh: '加购项 Add-on（由管理端设置）', en: 'Add-on (set by admin)' },
  addOnRequiredSuffix: { zh: '· 必选至少一项', en: '· Select at least one' },
  customerFullNameColon: { zh: '客户 Full Name：', en: 'Customer Full Name:' },
  phoneColonPlain: { zh: '电话：', en: 'Phone:' },
  orderTotalColonPlain: { zh: '订单总额：', en: 'Order Total:' },
  remarkColonPlain: { zh: '备注：', en: 'Remark:' },
  changeModelNoticePrefix: { zh: '这笔订单原本的 SO 编号', en: 'This order\u2019s original SO' },
  changeModelNoticeSuffix: { zh: '将会失效，修改商品后需要 Admin 重新审核并开立新的 SO。', en: 'will be voided. Once the product changes, Admin needs to review and issue a new SO.' },
  slipVerifiedPrefix: { zh: '系统已自动识别水单收款户名为', en: 'System auto-detected the slip payee as' },
  slipVerifiedSuffix: { zh: '，核对通过。', en: ', verified.' },
  driveSyncedPrefix: { zh: '已自动同步至 Google Drive 文件夹', en: 'Auto-synced to Google Drive folder' },
  driveSyncedMiddle: { zh: '，档名已存为', en: ', saved as' },
  driveSyncedSuffix2: { zh: '，方便日后以 SO 编号找回。', en: ', for easy retrieval by SO number later.' },
  changeModelResubmitLabel: { zh: '换款重新提交：', en: 'Model Changed \u0026 Resubmitted:' },
  changeModelResubmitPrefix: { zh: '原 SO 编号', en: 'Original SO' },
  changeModelResubmitSuffix: { zh: '已失效，需开立新 SO', en: 'voided, new SO required' },
  teamNameReuseNote: { zh: '已存在的团队名字会沿用；打新名字会自动建立新团队。', en: 'An existing team name will be reused; typing a new name creates a new team.' },
  addOnRequiredNote: { zh: '请至少选择一项加购项', en: 'Please select at least one add-on' },
  bankSlipWord: { zh: '水单', en: 'Slip' },
  depositSlipWord: { zh: '订金水单', en: 'Deposit Slip' },
  errFullNameRequired: { zh: 'Full Name 不能为空', en: 'Full Name is required' },
  errAlamatRequired: { zh: 'Alamat 不能为空', en: 'Alamat is required' },
  errPoscodeInvalid: { zh: 'Poscode 必须是 5 位数字，且介于 50000 至 89990 之间', en: 'Poscode must be 5 digits, between 50000 and 89990' },
  errPhone1Required: { zh: 'No Phone 1 不能为空', en: 'No Phone 1 is required' },
  errSalesExecRequired: { zh: '请选择 Sales Executive', en: 'Please select a Sales Executive' },
  errSalesmanPhoneRequired: { zh: 'Salesman Phone Number 不能为空', en: 'Salesman Phone Number is required' },
  errModelRequired: { zh: '每一项商品都必须选择型号 Model', en: 'Every item must have a model selected' },
  errQtyPositive: { zh: '数量必须大于 0', en: 'Quantity must be greater than 0' },
  errAmountPositive: { zh: 'Amount 必须大于 0', en: 'Amount must be greater than 0' },
  errLogisticRequired: { zh: '已勾选 7 天内送货，须上传物流批准的 WhatsApp 截图', en: '7-day delivery is checked \u2014 please upload the WhatsApp logistics approval screenshot' },
  errDepositSlipRequired2: { zh: '已选择客户有给订金，须上传订金水单才能提交订单', en: 'Deposit collected is checked \u2014 please upload the deposit slip before submitting' },
  errAddOnRequired: { zh: '第 {n} 项商品（{name}）有加购项，必须至少选择一个', en: 'Item {n} ({name}) has add-ons \u2014 please select at least one' },
  errImageRequired: { zh: '请上传商品图片后再保存', en: 'Please upload a product image before saving' },
  errCodeNameRequired: { zh: '编号与商品名称不能为空', en: 'Code and product name cannot be empty' },
  errPriceZero: { zh: '价格不可为 0，请填入实际售价', en: 'Price cannot be 0 \u2014 please enter the actual price' },
  errStockZero: { zh: '库存不可为 0，请填入实际库存数量', en: 'Stock cannot be 0 \u2014 please enter the actual stock quantity' },
  errCategoryRequired: { zh: '请选择商品分类', en: 'Please select a category' },
  errAddOnZero: { zh: '加购项「{name}」的库存不可为 0，价格不可为负数', en: 'Add-on "{name}": stock cannot be 0, price cannot be negative' },
  errCodeDuplicate: { zh: '商品编号「{code}」已被使用，请改用其他编号', en: 'Product code "{code}" is already in use \u2014 please choose another' },
  unnamedAddOn: { zh: '未命名', en: 'Unnamed' },
  errSalesmanNameDuplicate: { zh: '{name} 的账号已存在，请改用其他姓名', en: 'An account for {name} already exists \u2014 please use a different name' },
  errTeamHasLeader: { zh: '「{name}」已经有主管账号', en: '"{name}" already has a leader account' },
  payMethodBank: { zh: '银行转账 Bank Transfer', en: 'Bank Transfer' },
  payMethodCash: { zh: '现金 Cash', en: 'Cash' },
  payMethodCard: { zh: '信用卡 Credit Card', en: 'Credit Card' },
  payMethodInstallment: { zh: '分期 Installment', en: 'Installment Plan' },
  unnamedReason: { zh: '未说明原因', en: 'no reason given' },
  subtotalLabel: { zh: '小计', en: 'Subtotal' },
  depositUploadPlaceholder: { zh: '点击上传（图片/PDF）', en: 'Click to upload (image/PDF)' },
  salesmenCountSuffix: { zh: '位销售员', en: 'salesmen' },
  soIssuedSalesLabel: { zh: '本月已开SO的销售', en: 'SO Issued Sales This Month' },
  incompleteSalesLabel: { zh: '待申请佣金', en: 'Pending Claim' },
  completedSalesLabel: { zh: '已申请佣金', en: 'Claim Submitted' },
  incompleteSalesTitle: { zh: '待申请佣金（尚未提交）', en: 'Pending Commission Claim' },
  completedSalesTitle: { zh: '已申请佣金（已提交）', en: 'Commission Claim Submitted' },
  noIncompleteSales: { zh: '目前没有待申请佣金的订单', en: 'No orders pending a commission claim' },
  noCompletedSales: { zh: '目前还没有已申请佣金的订单', en: 'No commission claims submitted yet' },
  nav_history: { zh: '历史记录', en: 'History' },
  historyTitle: { zh: '历史销售记录', en: 'Sales History' },
  noHistoryYet: { zh: '还没有以往月份的记录', en: 'No past months yet' },
  totalSalesLabel: { zh: '总业绩', en: 'Total Sales' },
  currentMonthNote: { zh: '（本月资料显示在仪表板，这里只看以往月份）', en: '(This month\u2019s data is on the dashboard; this only shows past months.)' },
  orderDateTimeCol: { zh: '提交时间', en: 'Submitted At' },
  lastEditedLabel: { zh: '最后编辑：', en: 'Last edited:' },
  ordersCountPrefix: { zh: '共', en: 'Total' },
  ordersCountSuffix: { zh: '笔订单', en: 'orders' },
  viewWord: { zh: '查看', en: 'View' },
  openWord: { zh: '打开', en: 'Open' },
  teamOverviewPrefix: { zh: '团队总览 ·', en: 'Team Overview \u00b7' },
  adminTabOrders: { zh: '订单审核', en: 'Order Review' },
  adminTabItems: { zh: '商品管理', en: 'Product Catalog' },
  phSearchModel: { zh: '搜索型号编号、名称、颜色或分类…', en: 'Search by code, name, color, or category…' },
  phFullNameExample: { zh: '例：陈大文', en: 'e.g. John Tan' },
  phAlamatExample: { zh: '门牌、路名、城市、州属', en: 'Unit no., street, city, state' },
  phPoscodeExample: { zh: '例：58200', en: 'e.g. 58200' },
  phOptional: { zh: '选填', en: 'Optional' },
  phRemarkExample: { zh: '其他备注事项', en: 'Any other notes' },
  phCodeExample: { zh: '例：SF-003', en: 'e.g. SF-003' },
  phProductNameExample: { zh: '例：Milano 三人布艺沙发', en: 'e.g. Milano 3-Seater Fabric Sofa' },
  phColorExample: { zh: '例：雾灰 Fog Grey', en: 'e.g. Fog Grey' },
  phAddOnName: { zh: '加购项名称', en: 'Add-on name' },
  phStockPlain: { zh: '库存', en: 'Stock' },
  phPricePlain: { zh: '价格', en: 'Price' },
};

const LangContext = createContext({ lang: 'zh', setLang: () => {}, t: (k) => k });
function useLang() { return useContext(LangContext); }
function LangProvider({ children }) {
  const [lang, setLang] = useState('zh');
  const t = (key, vars) => {
    const entry = STRINGS[key];
    let str = entry ? (entry[lang] || entry.zh) : key;
    if (vars) Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, vars[k]); });
    return str;
  };
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}
function LangToggle({ dark }) {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: 'inline-flex', border: `1px solid ${dark ? '#3C3D35' : C.line}`, borderRadius: 20, overflow: 'hidden' }}>
      {['zh', 'en'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: '4px 12px', fontSize: 11.5, fontFamily: fontMono, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', border: 'none',
          background: lang === l ? C.wood : 'transparent', color: lang === l ? '#fff' : (dark ? '#B8B2A0' : C.sub),
        }}>{l === 'zh' ? '中文' : 'EN'}</button>
      ))}
    </div>
  );
}

/* ============================== 团队 Context ============================== */
const TeamsContext = createContext({ teams: {}, setTeams: () => {} });
function useTeamsCtx() { return useContext(TeamsContext); }
function TeamsProvider({ initialTeams, children }) {
  const [teams, setTeams] = useState(initialTeams || {});
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (!ready) return;
    upsertTeams(teamsMapToRows(teams));
  }, [teams]);
  return <TeamsContext.Provider value={{ teams, setTeams }}>{children}</TeamsContext.Provider>;
}

/* ============================== mock 数据 ============================== */
const INIT_TEAMS = {
  howly: { id: 'howly', name: '好丽家 Howly Home', leader: 'Ken Lee', members: ['Amy Tan', 'Ben Wong', 'Chloe Lim', 'David Ooi', 'Ellie Chong'] },
  nova: { id: 'nova', name: 'Nova Living', leader: 'Sarah Goh', members: ['Faye Ng', 'Gary Teh', 'Hana Lee'] },
};
const AGENT_TEAM = {};
Object.values(INIT_TEAMS).forEach(t => t.members.forEach(m => (AGENT_TEAM[m] = t.id)));

// 账号（登入权限）——只有 Finance 能新增/删除，团队本身也是数据（可由 Finance 新增），不代表能登入
function seedAccounts() {
  const list = [];
  let idc = 1;
  Object.values(INIT_TEAMS).forEach(t => {
    list.push({ id: idc++, role: 'leader', team: t.id, password: '123456' });
    t.members.forEach(m => list.push({ id: idc++, role: 'salesman', name: m, team: t.id, password: '123456' }));
  });
  list.push({ id: idc++, role: 'admin', name: 'Admin User', password: '123456' });
  return list;
}
const INIT_ACCOUNTS = seedAccounts();

const CATEGORIES = ['TV CABINET', 'SOFA', 'COFFEE TABLE', 'DINING SET', 'WARDROBE'];

const INIT_ITEMS = [
  { id: 1, code: 'SF-001', name: 'Milano 三人布艺沙发', price: 3299, stock: 12, color: '雾灰 Fog Grey', category: 'SOFA', image: null, addOns: [{ code: 'AO-01', name: '防污布料处理 Fabric Protection', price: 150, stock: 40 }, { code: 'AO-02', name: '不锈钢脚架升级 Steel Leg Upgrade', price: 80, stock: 25 }] },
  { id: 2, code: 'SF-002', name: 'Nordic 真皮沙发', price: 5899, stock: 5, color: '焦糖棕 Caramel', category: 'SOFA', image: null, addOns: [{ code: 'AO-03', name: '真皮保养套装 Leather Care Kit', price: 180, stock: 15 }] },
  { id: 3, code: 'DT-010', name: 'Oslo 实木餐桌套装 1+6', price: 2199, stock: 8, color: '原木色 Natural Oak', category: 'DINING SET', image: null, addOns: [{ code: 'AO-04', name: '延长桌板 Extension Leaf', price: 320, stock: 10 }] },
  { id: 4, code: 'WD-005', name: 'Kyoto 三门衣柜', price: 2599, stock: 6, color: '胡桃木 Walnut', category: 'WARDROBE', image: null, addOns: [{ code: 'AO-06', name: '内置抽屉组 Internal Drawer Set', price: 250, stock: 12 }] },
  { id: 5, code: 'CT-014', name: 'Luna 大理石茶几', price: 899, stock: 20, color: '白色大理石 White Marble', category: 'COFFEE TABLE', image: null, addOns: [] },
  { id: 6, code: 'CT-015', name: 'Nordic 圆形茶几', price: 749, stock: 14, color: '原木色 Natural Oak', category: 'COFFEE TABLE', image: null, addOns: [] },
  { id: 7, code: 'TV-002', name: 'Nova 电视柜 1.8m', price: 1299, stock: 10, color: '黑胡桃 Black Walnut', category: 'TV CABINET', image: null, addOns: [{ code: 'AO-07', name: 'LED 灯条 LED Strip', price: 60, stock: 30 }] },
];

const INIT_ORDERS = [
  { id: 'ORD-1001', customer: '林伟强', agent: 'Amy Tan', team: 'howly', poscode: 'PS-88213', items: [{ code: 'SF-001', qty: 1, price: 3299 }], total: 3299, status: 'pending_so', soNumber: null, date: '2026-06-28' },
  { id: 'ORD-1002', customer: 'Tan Mei Ling', agent: 'Ben Wong', team: 'howly', poscode: 'PS-88240', items: [{ code: 'DT-010', qty: 1, price: 2199 }, { code: 'CT-014', qty: 1, price: 899 }], total: 3098, status: 'pending_so', soNumber: null, date: '2026-06-29', alamat: 'No. 12, Jalan Meranti, Taman Sri Aman, Kuala Lumpur', phone1: '012-3456789', phone2: '', salesExecutive: 'Ben Wong', salesmanPhone: '013-9876543', deliveryUrgent: true, logisticFile: 'whatsapp_logistic_approval.jpg', logisticFileUrl: null, logisticFileType: 'image/jpeg', logisticStatus: 'pending', remark: '客户下周有喜宴，急需送货。' },
  { id: 'ORD-1005', customer: 'Wong Su Ling', agent: 'Gary Teh', team: 'nova', poscode: 'PS-88301', items: [{ code: 'BK-008', qty: 2, price: 659 }], total: 1318, status: 'pending_so', soNumber: null, date: '2026-07-01' },
  { id: 'ORD-0997', customer: 'Rajesh Kumar', agent: 'Amy Tan', team: 'howly', poscode: 'PS-87990', items: [{ code: 'BD-021', qty: 1, price: 1899 }], total: 1899, status: 'so_opened', soNumber: 'SO-20260615-07', date: '2026-06-15', depositAmount: 300, depositSlip: 'deposit_0997.jpg', depositSlipUrl: null, depositSlipType: 'image/jpeg' },
  { id: 'ORD-0988', customer: 'Siti Aminah', agent: 'Faye Ng', team: 'nova', poscode: 'PS-87650', items: [{ code: 'WD-005', qty: 1, price: 2599 }], total: 2599, status: 'so_opened', soNumber: 'SO-20260610-03', date: '2026-06-10' },
  { id: 'ORD-0975', customer: 'Ooi Ka Wei', agent: 'Chloe Lim', team: 'howly', poscode: 'PS-87400', items: [{ code: 'SF-002', qty: 1, price: 5899 }], total: 5899, status: 'so_opened', soNumber: 'SO-20260602-01', date: '2026-06-02' },
];

const INIT_CLAIMS = [
  { id: 'CM-3001', orderId: 'ORD-0997', agent: 'Amy Tan', team: 'howly', method: 'bank', slipFile: 'slip_0997.jpg', slipAmount: 2000, itemAmount: 1899, claimAmount: 101, transferVerified: true, status: 'verified', date: '2026-06-16' },
  { id: 'CM-3002', orderId: 'ORD-0988', agent: 'Faye Ng', team: 'nova', method: 'bank', slipFile: 'slip_0988.jpg', slipAmount: 2599, itemAmount: 2599, claimAmount: 0, transferVerified: true, status: 'pending', date: '2026-06-11' },
  { id: 'CM-3003', orderId: 'ORD-0975', agent: 'Chloe Lim', team: 'howly', method: 'cash', slipFile: 'slip_0975.jpg', slipAmount: 5799, itemAmount: 5899, claimAmount: -100, transferVerified: false, status: 'rejected', date: '2026-06-03' },
];

const RM = n => `RM ${Number(n).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
const monthKey = dateStr => (dateStr ? dateStr.slice(0, 7) : '');
const currentMonthKey = () => new Date().toISOString().slice(0, 7);
const formatMonthLabel = (m, lang) => {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(y, mo - 1, 1);
  return d.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' });
};
const nowDateTime = () => {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const PAYMENT_METHODS = [
  { code: 'bank', key: 'payMethodBank' },
  { code: 'cash', key: 'payMethodCash' },
  { code: 'card', key: 'payMethodCard' },
  { code: 'installment', key: 'payMethodInstallment' },
];

/* ============================== Supabase 资料转换 ============================== */
// DB 用 snake_case，app 里面用 camelCase，这里做两边的转换

function teamsRowsToMap(rows) {
  const map = {};
  rows.forEach(r => { map[r.id] = { id: r.id, name: r.name, leader: r.leader, members: [] }; });
  return map;
}
function teamsMapToRows(map) {
  return Object.values(map).map(t => ({ id: t.id, name: t.name, leader: t.leader || null }));
}

function accountRowToApp(r) {
  return { id: r.id, role: r.role, name: r.name, team: r.team, email: r.email };
}

function itemRowToApp(r) {
  return { id: r.id, code: r.code, name: r.name, price: Number(r.price), stock: r.stock, color: r.color, category: r.category, image: r.image, addOns: r.add_ons || [] };
}
function itemAppToRow(it) {
  return { id: it.id, code: it.code, name: it.name, price: it.price, stock: it.stock, color: it.color, category: it.category, image: it.image || null, add_ons: it.addOns || [] };
}

function orderRowToApp(r) {
  return {
    id: r.id, customer: r.customer, alamat: r.alamat, poscode: r.poscode, phone1: r.phone1, phone2: r.phone2,
    agent: r.agent, team: r.team, salesExecutive: r.sales_executive, salesmanPhone: r.salesman_phone,
    items: r.items || [], amount: Number(r.amount), total: Number(r.total), status: r.status,
    soNumber: r.so_number, soFileUrl: r.so_file_url, soFileName: r.so_file_name, rejectReason: r.reject_reason,
    previousSoNumber: r.previous_so_number, deliveryUrgent: r.delivery_urgent, logisticFile: r.logistic_file,
    logisticFileUrl: r.logistic_file_url, logisticFileType: r.logistic_file_type, logisticStatus: r.logistic_status,
    depositAmount: r.deposit_amount != null ? Number(r.deposit_amount) : null, depositSlip: r.deposit_slip,
    depositSlipUrl: r.deposit_slip_url, depositSlipType: r.deposit_slip_type, remark: r.remark, date: r.order_date, updatedAt: r.updated_at,
  };
}
function orderAppToRow(o) {
  return {
    id: o.id, customer: o.customer, alamat: o.alamat || null, poscode: o.poscode || null, phone1: o.phone1 || null, phone2: o.phone2 || null,
    agent: o.agent, team: o.team, sales_executive: o.salesExecutive || null, salesman_phone: o.salesmanPhone || null,
    items: o.items || [], amount: o.amount, total: o.total, status: o.status,
    so_number: o.soNumber || null, so_file_url: o.soFileUrl || null, so_file_name: o.soFileName || null, reject_reason: o.rejectReason || null,
    previous_so_number: o.previousSoNumber || null, delivery_urgent: !!o.deliveryUrgent, logistic_file: o.logisticFile || null,
    logistic_file_url: o.logisticFileUrl || null, logistic_file_type: o.logisticFileType || null, logistic_status: o.logisticStatus || null,
    deposit_amount: o.depositAmount != null ? o.depositAmount : null, deposit_slip: o.depositSlip || null,
    deposit_slip_url: o.depositSlipUrl || null, deposit_slip_type: o.depositSlipType || null, remark: o.remark || null, order_date: o.date || null, updated_at: o.updatedAt || null,
  };
}

function claimRowToApp(r) {
  return {
    id: r.id, orderId: r.order_id, agent: r.agent, team: r.team, method: r.method, slipFile: r.slip_file,
    slipUrl: r.slip_url, slipType: r.slip_type, slipAmount: r.slip_amount != null ? Number(r.slip_amount) : null,
    itemAmount: r.item_amount != null ? Number(r.item_amount) : null, claimAmount: r.claim_amount != null ? Number(r.claim_amount) : null,
    transferVerified: r.transfer_verified, status: r.status, driveFileName: r.drive_file_name, driveFolder: r.drive_folder,
    driveFolderUrl: r.drive_folder_url, date: r.claim_date,
  };
}
function claimAppToRow(c) {
  return {
    id: c.id, order_id: c.orderId, agent: c.agent, team: c.team, method: c.method, slip_file: c.slipFile || null,
    slip_url: c.slipUrl || null, slip_type: c.slipType || null, slip_amount: c.slipAmount, item_amount: c.itemAmount, claim_amount: c.claimAmount,
    transfer_verified: !!c.transferVerified, status: c.status, drive_file_name: c.driveFileName || null, drive_folder: c.driveFolder || null,
    drive_folder_url: c.driveFolderUrl || null, claim_date: c.date || null,
  };
}

// 小型表格的「全部删除再整批写入」同步方式：用在支援删除功能的表格（accounts、items）
async function replaceTable(table, rows) {
  try {
    await supabase.from(table).delete().not('id', 'is', null);
    if (rows.length > 0) {
      const { error } = await supabase.from(table).insert(rows);
      if (error) console.error(`sync ${table} failed:`, error.message);
    }
  } catch (e) {
    console.error(`sync ${table} error:`, e);
  }
}
// upsert：用在 app 里不会被删除、但会被别的表格用外键参照的表格（teams、orders、claims）
async function upsertRows(table, rows) {
  try {
    if (rows.length > 0) {
      const { error } = await supabase.from(table).upsert(rows);
      if (error) console.error(`sync ${table} failed:`, error.message);
    }
  } catch (e) {
    console.error(`sync ${table} error:`, e);
  }
}
async function upsertTeams(rows) { return upsertRows('teams', rows); }

// 把文件真的传到对应的 Google Drive 资料夹（透过 drive-upload Edge Function）
async function uploadToDrive(file, docType) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', docType);
  formData.append('fileName', file.name);
  const { data, error } = await supabase.functions.invoke('drive-upload', { body: formData });
  if (error || data?.error) throw new Error((data && data.error) || error.message);
  return data.url;
}

/* ============================== 小组件 ============================== */
function StampBadge({ status }) {
  const { t } = useLang();
  const map = {
    pending_so: { label: t('status_pending_so'), color: C.ochre },
    so_opened: { label: t('status_so_opened'), color: C.teal },
    so_rejected: { label: t('status_so_rejected'), color: C.brick },
    pending: { label: t('status_pending'), color: C.ochre },
    verified: { label: t('status_verified'), color: C.teal },
    rejected: { label: t('status_rejected'), color: C.brick },
  };
  const s = map[status] || { label: status, color: C.sub };
  return (
    <span
      style={{
        display: 'inline-block',
        border: `2.5px double ${s.color}`,
        color: s.color,
        fontFamily: fontMono,
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        borderRadius: 3,
        transform: 'rotate(-2.5deg)',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

function StatCard({ label, value, sub, color = C.wood, icon: Icon }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: '18px 20px', flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.sub, letterSpacing: '0.03em' }}>{label}</span>
        {Icon && <Icon size={16} color={color} />}
      </div>
      <div style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 600, color: C.ink }}>{value}</div>
      {sub && <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <div>
        {eyebrow && <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.12em', color: C.wood, textTransform: 'uppercase', marginBottom: 4 }}>{eyebrow}</div>}
        <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: C.ink }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', size = 'md', icon: Icon, disabled, type = 'button' }) {
  const base = {
    fontFamily: fontBody, fontWeight: 600, borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid transparent',
    fontSize: size === 'sm' ? 12.5 : 13.5, padding: size === 'sm' ? '6px 12px' : '9px 16px',
    opacity: disabled ? 0.5 : 1, transition: 'filter .15s',
  };
  const styles = {
    primary: { background: C.wood, color: '#fff' },
    outline: { background: 'transparent', color: C.ink, borderColor: C.line },
    ghost: { background: 'transparent', color: C.sub },
    teal: { background: C.teal, color: '#fff' },
    brick: { background: C.brick, color: '#fff' },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...styles[variant] }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.filter = 'brightness(0.93)')}
      onMouseLeave={e => (e.currentTarget.style.filter = 'none')}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontFamily: fontBody, fontSize: 12.5, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {children}
    </label>
  );
}
const inputStyle = { width: '100%', boxSizing: 'border-box', border: `1px solid ${C.line}`, borderRadius: 6, padding: '9px 11px', fontFamily: fontBody, fontSize: 13.5, background: C.surface, color: C.ink };

/* ============================== 登录 / 角色选择 ============================== */

function AuthStep({ pendingUser, onBack, onSuccess }) {
  const { t } = useLang();
  const [mode, setMode] = useState('password'); // 'password' | 'faceid'
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [checking, setChecking] = useState(false);

  const submitPassword = async () => {
    if (!pendingUser.email) { setError(t('wrongPassword')); return; }
    setChecking(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: pendingUser.email, password });
    setChecking(false);
    if (!authError) { setError(''); onSuccess(); }
    else setError(t('wrongPassword'));
  };

  const startFaceId = () => {
    setError(''); setScanning(true);
    setTimeout(() => { setScanning(false); onSuccess(); }, 1600);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <button onClick={onBack} style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', color: '#B8B2A0', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: fontBody, fontSize: 13 }}>
        <ArrowLeft size={15} /> {t('back')}
      </button>

      <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#2C2E28', border: `1.5px solid ${C.woodLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: fontDisplay, fontSize: 24, color: C.woodLight, fontWeight: 600 }}>{pendingUser.name.slice(0, 1)}</span>
      </div>
      <div style={{ fontFamily: fontDisplay, fontSize: 21, color: '#F5F1E8', fontWeight: 600 }}>{pendingUser.name}</div>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: C.woodLight, letterSpacing: '0.08em', marginTop: 3, marginBottom: 26, textTransform: 'uppercase' }}>
        {{ salesman: t('role_salesman'), leader: t('role_leader'), admin: t('role_admin'), finance: t('role_finance') }[pendingUser.role]}
      </div>

      <div style={{ width: '100%', maxWidth: 320 }}>
        {mode === 'password' ? (
          <div>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && submitPassword()}
                placeholder={t('password')}
                autoFocus
                style={{ width: '100%', boxSizing: 'border-box', background: '#2C2E28', border: `1px solid ${error ? C.brick : '#3C3D35'}`, borderRadius: 8, padding: '12px 40px 12px 14px', color: '#F5F1E8', fontFamily: fontMono, fontSize: 15, letterSpacing: '0.15em' }}
              />
              <button onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8A8474', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <div style={{ color: C.brick, fontSize: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={13} /> {error}</div>}
            <button onClick={submitPassword} disabled={checking} style={{ width: '100%', background: C.wood, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontFamily: fontBody, fontWeight: 700, fontSize: 14, cursor: checking ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: checking ? 0.6 : 1 }}>
              <Lock size={15} /> {checking ? '…' : t('login')}
            </button>
            <button onClick={() => setMode('faceid')} style={{ width: '100%', background: 'none', border: 'none', color: '#B8B2A0', marginTop: 14, fontFamily: fontBody, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Fingerprint size={14} /> {t('useFaceId')}
            </button>
            {pendingUser.role !== 'finance' && (
              <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8A8474', marginTop: 14 }}>{t('forgotPasswordNote')}</div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={startFaceId} disabled={scanning} style={{
              width: 112, height: 112, borderRadius: '50%', background: '#2C2E28',
              border: `2px solid ${scanning ? C.woodLight : '#3C3D35'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: scanning ? 'default' : 'pointer', marginBottom: 16,
            }}>
              {scanning ? <Loader2 size={34} color={C.woodLight} style={{ animation: 'spin 1s linear infinite' }} /> : <Fingerprint size={34} color={C.woodLight} />}
            </button>
            <div style={{ color: '#B8B2A0', fontSize: 12.5, fontFamily: fontBody, marginBottom: 18, textAlign: 'center' }}>
              {scanning ? t('faceIdScanning') : t('faceIdTap')}
            </div>
            <button onClick={() => setMode('password')} style={{ background: 'none', border: 'none', color: '#B8B2A0', fontFamily: fontBody, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} /> {t('usePassword')}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function LoginScreen({ onLogin, accounts }) {
  const { t } = useLang();
  const { teams } = useTeamsCtx();
  const [role, setRole] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const roles = [
    { id: 'salesman', title: t('role_salesman'), sub: t('role_salesman_sub'), desc: t('role_salesman_desc'), icon: ClipboardList },
    { id: 'leader', title: t('role_leader'), sub: t('role_leader_sub'), desc: t('role_leader_desc'), icon: Users },
    { id: 'admin', title: t('role_admin'), sub: t('role_admin_sub'), desc: t('role_admin_desc'), icon: FileStack },
    { id: 'finance', title: t('role_finance'), sub: t('role_finance_sub'), desc: t('role_finance_desc'), icon: Receipt },
  ];

  if (!role) {
    return (
      <div style={{ minHeight: '100vh', background: C.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ position: 'absolute', top: 24, right: 24 }}><LangToggle dark /></div>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Building2 size={22} color={C.woodLight} />
            <span style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: '0.25em', color: C.woodLight, textTransform: 'uppercase' }}>EE Life Design Sdn. Bhd.</span>
          </div>
          <div style={{ fontFamily: fontDisplay, fontSize: 34, fontWeight: 600, color: '#F5F1E8' }}>{t('appName')}</div>
          <div style={{ fontFamily: fontBody, fontSize: 13.5, color: '#B8B2A0', marginTop: 6 }}>{t('chooseRole')}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: '100%', maxWidth: 880 }}>
          {roles.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)}
              style={{ textAlign: 'left', background: '#2C2E28', border: `1px solid #3C3D35`, borderRadius: 12, padding: 22, cursor: 'pointer', color: '#F5F1E8' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.woodLight)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#3C3D35')}>
              <r.icon size={20} color={C.woodLight} />
              <div style={{ fontFamily: fontDisplay, fontSize: 19, fontWeight: 600, marginTop: 12 }}>{r.title}</div>
              <div style={{ fontFamily: fontMono, fontSize: 11, color: C.woodLight, marginTop: 2, letterSpacing: '0.05em' }}>{r.sub}</div>
              <div style={{ fontFamily: fontBody, fontSize: 12.5, color: '#B8B2A0', marginTop: 10, lineHeight: 1.5 }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 第三步：密码 / Face ID 验证（实际密码比对在 AuthStep 内透过数据库函式处理，前端不接触密码）
  if (pendingUser) {
    return <AuthStep pendingUser={pendingUser} onBack={() => setPendingUser(null)} onSuccess={() => onLogin(pendingUser)} />;
  }

  // 第二步：选择具体人员 —— 名单来自 Finance 建立的账号，不是自行注册
  let people = [];
  if (role === 'salesman') people = accounts.filter(a => a.role === 'salesman').map(a => ({ key: a.id, label: a.name, sub: teams[a.team]?.name, team: a.team, accountId: a.id, email: a.email }));
  if (role === 'leader') people = accounts.filter(a => a.role === 'leader').map(a => ({ key: a.id, label: teams[a.team]?.name, sub: teams[a.team]?.leader ? `Team Leader · ${teams[a.team].leader}` : null, team: a.team, leaderName: teams[a.team]?.leader, accountId: a.id, email: a.email }));
  if (role === 'admin') people = accounts.filter(a => a.role === 'admin').map(a => ({ key: a.id, label: a.name, team: null, accountId: a.id, email: a.email }));
  if (role === 'finance') people = accounts.filter(a => a.role === 'finance').map(a => ({ key: a.id, label: a.name || 'Finance User', team: null, accountId: a.id, email: a.email }));

  return (
    <div style={{ minHeight: '100vh', background: C.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <button onClick={() => setRole(null)} style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', color: '#B8B2A0', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: fontBody, fontSize: 13 }}>
        <ArrowLeft size={15} /> {t('back')}
      </button>
      <div style={{ fontFamily: fontDisplay, fontSize: 24, color: '#F5F1E8', marginBottom: 20 }}>{t('imA')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
        {people.length === 0 && (
          <div style={{ color: '#8A8474', fontSize: 13, textAlign: 'center', maxWidth: 300 }}>{t('noAccountsYet')}</div>
        )}
        {people.map(p => (
          <button key={p.key} onClick={() => setPendingUser({ role, name: p.label, team: p.team, leaderName: p.leaderName, accountId: p.accountId, email: p.email })}
            style={{ background: '#2C2E28', border: `1px solid #3C3D35`, borderRadius: 8, padding: '12px 16px', color: '#F5F1E8', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: fontBody, fontSize: 14 }}>
            <span>{p.label}{p.sub ? <span style={{ color: '#8A8474', fontSize: 12 }}> · {p.sub}</span> : ''}</span>
            <ChevronRight size={16} color={C.woodLight} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================== 外壳：顶栏 + 侧栏 ============================== */
function ChangePasswordPanel({ user, accounts, setAccounts, onClose }) {
  const { t } = useLang();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    if (!next.trim() || next.length < 6) { setError(t('passwordTooShort')); return; }
    if (next !== confirm) { setError(t('passwordMismatch')); return; }
    setChecking(true);
    // 用目前密码重新登入一次来确认「目前密码」真的是对的
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (verifyError) { setChecking(false); setError(t('currentPasswordWrong')); return; }
    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setChecking(false);
    if (updateError) { setError(updateError.message); return; }
    setError(''); setDone(true);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 12, padding: 24, width: 320 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: C.ink, marginBottom: 14 }}>{t('changePassword')}</div>
        {done ? (
          <div style={{ color: C.teal, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}><CheckCircle2 size={16} /> {t('passwordUpdated')}</div>
        ) : (
          <>
            <Field label={t('currentPassword')}><input type="password" style={inputStyle} value={current} onChange={e => setCurrent(e.target.value)} /></Field>
            <Field label={t('newPassword')}><input type="password" style={inputStyle} value={next} onChange={e => setNext(e.target.value)} /></Field>
            <Field label={t('confirmNewPassword')}><input type="password" style={inputStyle} value={confirm} onChange={e => setConfirm(e.target.value)} /></Field>
            {error && <div style={{ color: C.brick, fontSize: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={13} /> {error}</div>}
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {!done && <Btn icon={Lock} onClick={submit} disabled={checking}>{checking ? '…' : t('save')}</Btn>}
          <Btn variant="ghost" onClick={onClose}>{done ? t('confirm') : t('cancel')}</Btn>
        </div>
      </div>
    </div>
  );
}

function Shell({ user, view, setView, navItems, onLogout, accounts, setAccounts, children }) {
  const { t } = useLang();
  const [showPwPanel, setShowPwPanel] = useState(false);
  return (
    <div className="shell-root" style={{ minHeight: '100vh', background: C.paper, display: 'flex', fontFamily: fontBody }}>
      <style>{`
        @media (max-width: 760px) {
          .shell-root { flex-direction: column !important; min-height: 0 !important; }
          .shell-sidebar { width: 100% !important; flex-direction: column !important; padding: 12px 14px !important; box-sizing: border-box !important; }
          .shell-brand { padding-bottom: 10px !important; margin-bottom: 10px !important; }
          .shell-nav { flex-direction: row !important; flex-wrap: wrap !important; gap: 6px !important; }
          .shell-nav button { flex: 1 1 auto !important; justify-content: center !important; }
          .shell-foot { flex-direction: row !important; flex-wrap: wrap !important; align-items: center !important; border-top: 1px solid #3C3D35; padding-top: 10px !important; margin-top: 10px !important; gap: 10px 16px !important; }
          .shell-foot-id { flex: 1 1 auto !important; }
          .shell-content { padding: 14px !important; }
        }
      `}</style>
      {showPwPanel && <ChangePasswordPanel user={user} accounts={accounts} setAccounts={setAccounts} onClose={() => setShowPwPanel(false)} />}
      <div className="shell-sidebar" style={{ width: 220, background: C.ink, color: '#F5F1E8', display: 'flex', flexDirection: 'column', padding: '22px 14px', flexShrink: 0 }}>
        <div className="shell-brand" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 22px', borderBottom: '1px solid #3C3D35', marginBottom: 18 }}>
          <Building2 size={18} color={C.woodLight} />
          <div>
            <div style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>EE Life Design</div>
            <div style={{ fontFamily: fontMono, fontSize: 9.5, color: '#8A8474', letterSpacing: '0.08em' }}>{t('appName')}</div>
          </div>
        </div>
        <div className="shell-nav" style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: view === item.id ? '#3A3B32' : 'transparent', color: view === item.id ? '#F5F1E8' : '#B8B2A0',
                fontFamily: fontBody, fontSize: 13.5, fontWeight: view === item.id ? 600 : 500, textAlign: 'left', whiteSpace: 'nowrap',
              }}>
              <item.icon size={16} color={view === item.id ? C.woodLight : '#8A8474'} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="shell-foot" style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #3C3D35', paddingTop: 14, marginTop: 10 }}>
          <div className="shell-foot-id">
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontFamily: fontMono, fontSize: 10.5, color: C.woodLight, marginTop: 2, textTransform: 'uppercase' }}>{t(`role_${user.role}`)}</div>
            {user.leaderName && <div style={{ fontSize: 11, color: '#8A8474', marginTop: 2 }}>{user.leaderName}</div>}
          </div>
          <LangToggle dark />
          {user.accountId != null && (
            <button onClick={() => setShowPwPanel(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#B8B2A0', cursor: 'pointer', fontSize: 12.5, fontFamily: fontBody, whiteSpace: 'nowrap' }}>
              <Lock size={13} /> {t('changePassword')}
            </button>
          )}
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#B8B2A0', cursor: 'pointer', fontSize: 12.5, fontFamily: fontBody, whiteSpace: 'nowrap' }}>
            <LogOut size={13} /> {t('switchRole')}
          </button>
        </div>
      </div>
      <div className="shell-content" style={{ flex: 1, padding: '28px 32px', overflowX: 'auto', minWidth: 0 }}>{children}</div>
    </div>
  );
}

/* ============================== 团队业绩图 ============================== */
function TeamChart({ team, orders, accounts }) {
  const members = accounts.filter(a => a.role === 'salesman' && a.team === team.id).map(a => a.name);
  const thisMonth = currentMonthKey();
  const data = members.map(m => ({
    name: m.split(' ')[0],
    sales: orders.filter(o => o.agent === m && o.status === 'so_opened' && monthKey(o.date) === thisMonth).reduce((s, o) => s + o.total, 0),
  }));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: '18px 20px', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.line} />
          <XAxis dataKey="name" tick={{ fontFamily: fontBody, fontSize: 11.5, fill: C.sub }} axisLine={{ stroke: C.line }} tickLine={false} />
          <YAxis tick={{ fontFamily: fontMono, fontSize: 10.5, fill: C.sub }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
          <Tooltip formatter={v => RM(v)} contentStyle={{ fontFamily: fontBody, fontSize: 12.5, border: `1px solid ${C.line}`, borderRadius: 6 }} />
          <Bar dataKey="sales" radius={[5, 5, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={C.wood} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================== 订单表 ============================== */
function OrderTable({ orders, showAgent = true, actions }) {
  const { t } = useLang();
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
        <thead>
          <tr style={{ background: C.woodTint }}>
            <th style={th}>{t('orderIdCol')}</th>
            <th style={th}>{t('orderDateTimeCol')}</th>
            <th style={th}>{t('customerCol')}</th>
            {showAgent && <th style={th}>{t('agentCol')}</th>}
            <th style={th}>POS Code</th>
            <th style={th}>{t('itemsCol')}</th>
            <th style={th}>{t('amountCol')}</th>
            <th style={th}>{t('statusCol')}</th>
            <th style={th}>{t('soFileCol')}</th>
            {actions && <th style={th}></th>}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr><td colSpan={10} style={{ ...td, textAlign: 'center', color: C.sub, padding: 30 }}>{t('noRecords')}</td></tr>
          )}
          {orders.map(o => (
            <tr key={o.id} style={{ borderTop: `1px solid ${C.line}` }}>
              <td style={{ ...td, fontFamily: fontMono }}>{o.id}{o.soNumber && <div style={{ fontSize: 10.5, color: C.teal }}>{o.soNumber}</div>}</td>
              <td style={{ ...td, fontFamily: fontMono, fontSize: 11.5, color: C.sub, whiteSpace: 'nowrap' }}>
                {o.date || '—'}
                {o.updatedAt && o.updatedAt !== o.date && (
                  <div style={{ color: C.wood, marginTop: 2 }}>{t('lastEditedLabel')}<br />{o.updatedAt}</div>
                )}
              </td>
              <td style={td}>{o.customer}</td>
              {showAgent && <td style={td}>{o.agent}</td>}
              <td style={{ ...td, fontFamily: fontMono, fontSize: 12 }}>{o.poscode}</td>
              <td style={{ ...td, fontSize: 12, color: C.sub }}>{o.items.map(it => it.code).join(', ')}</td>
              <td style={{ ...td, fontFamily: fontMono, fontWeight: 600 }}>{RM(o.total)}</td>
              <td style={td}><StampBadge status={o.status} /></td>
              <td style={td}>
                {o.soFileUrl ? (
                  <a href={o.soFileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: C.wood, fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>
                    <FileText size={14} /> {o.soFileName || 'SO.pdf'}
                  </a>
                ) : o.status === 'so_rejected' ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, color: C.brick, fontSize: 12 }}>
                    <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{o.rejectReason || t('unnamedReason')}</span>
                  </div>
                ) : <span style={{ color: C.sub, fontSize: 12 }}>—</span>}
              </td>
              {actions && <td style={td}>{actions(o)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th = { textAlign: 'left', padding: '10px 14px', fontSize: 11.5, letterSpacing: '0.04em', color: C.wood, fontWeight: 700, textTransform: 'uppercase' };
const td = { padding: '11px 14px', color: C.ink, verticalAlign: 'top' };

function SalesHistory({ orders, showAgent = false }) {
  const { t, lang } = useLang();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const soOrders = orders.filter(o => o.status === 'so_opened');
  const thisMonth = currentMonthKey();
  const pastOrders = soOrders.filter(o => monthKey(o.date) && monthKey(o.date) !== thisMonth);
  const months = [...new Set(pastOrders.map(o => monthKey(o.date)))].sort().reverse();
  const monthOrders = m => pastOrders.filter(o => monthKey(o.date) === m);
  const monthTotal = m => monthOrders(m).reduce((s, o) => s + o.total, 0);
  const active = selectedMonth && months.includes(selectedMonth) ? selectedMonth : months[0] || null;

  return (
    <div>
      <SectionTitle eyebrow="History" title={t('historyTitle')} />
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 16 }}>{t('currentMonthNote')}</div>
      {months.length === 0 ? (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 30, textAlign: 'center', color: C.sub, fontSize: 13 }}>{t('noHistoryYet')}</div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {months.map(m => (
              <button key={m} onClick={() => setSelectedMonth(m)}
                style={{
                  textAlign: 'left', border: `1.5px solid ${active === m ? C.wood : C.line}`, background: active === m ? C.woodTint : C.surface,
                  borderRadius: 10, padding: '10px 16px', cursor: 'pointer', minWidth: 140,
                }}>
                <div style={{ fontFamily: fontBody, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{formatMonthLabel(m, lang)}</div>
                <div style={{ fontFamily: fontMono, fontSize: 14, fontWeight: 700, color: C.wood, marginTop: 2 }}>{RM(monthTotal(m))}</div>
              </button>
            ))}
          </div>
          {active && (
            <>
              <SectionTitle title={`${formatMonthLabel(active, lang)} · ${t('totalSalesLabel')} ${RM(monthTotal(active))}`} />
              <OrderTable orders={monthOrders(active)} showAgent={showAgent} />
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ============================== Salesman ============================== */
function SalesmanDashboard({ user, orders, items, claims, setOrders, setClaims, accounts }) {
  const { t } = useLang();
  const { teams } = useTeamsCtx();
  const [view, setView] = useState('home');
  const [editingOrder, setEditingOrder] = useState(null);
  const team = teams[user.team];
  const myOrders = orders.filter(o => o.agent === user.name);
  const teamOrders = orders.filter(o => o.team === user.team);
  const thisMonth = currentMonthKey();
  const teamTotal = teamOrders.filter(o => o.status === 'so_opened' && monthKey(o.date) === thisMonth).reduce((s, o) => s + o.total, 0);
  const teamMemberCount = accounts.filter(a => a.role === 'salesman' && a.team === user.team).length;

  const mySoOrders = myOrders.filter(o => o.status === 'so_opened' && monthKey(o.date) === thisMonth);
  const myClaims = claims.filter(c => c.agent === user.name);
  const claimedOrderIds = new Set(myClaims.map(c => c.orderId));
  const incompleteSales = mySoOrders.filter(o => !claimedOrderIds.has(o.id));
  const completedSales = mySoOrders.filter(o => claimedOrderIds.has(o.id));

  if (view === 'newOrder') return <OrderForm user={user} items={items} accounts={accounts} onCancel={() => setView('home')} onSubmit={o => { setOrders(prev => [o, ...prev]); setView('home'); }} />;
  if (view === 'editOrder' && editingOrder) return (
    <OrderForm
      user={user} items={items} accounts={accounts} editOrder={editingOrder}
      onCancel={() => { setEditingOrder(null); setView('home'); }}
      onSubmit={o => { setOrders(prev => prev.map(x => x.id === editingOrder.id ? o : x)); setEditingOrder(null); setView('home'); }}
    />
  );
  if (view === 'claim') return <ClaimWizard user={user} orders={orders} setView={setView} onSubmit={claim => setClaims(prev => [claim, ...prev])} />;

  return (
    <div>
      <SectionTitle eyebrow={team.name} title={`${t('welcomeBack')}，${user.name.split(' ')[0]}`} right={
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Btn variant="outline" icon={Receipt} onClick={() => setView('claim')}>{t('claimWizardTitle')}</Btn>
          <Btn icon={Plus} onClick={() => setView('newOrder')}>{t('newOrder')}</Btn>
        </div>
      } />
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label={t('statTeamTotal')} value={RM(teamTotal)} sub={`${team.name} · ${teamMemberCount} ${t('salesmenCountSuffix')}`} icon={TrendingUp} />
        <StatCard label={t('statMyOrders')} value={myOrders.length} sub={`${myOrders.filter(o => o.status === 'pending_so').length} ${t('statPendingSoCount')}`} icon={ClipboardList} />
        <StatCard label={t('statMyClaims')} value={t('viewWord')} sub={t('clickToStart')} color={C.teal} icon={Receipt} />
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label={t('soIssuedSalesLabel')} value={mySoOrders.length} sub={RM(mySoOrders.reduce((s, o) => s + o.total, 0))} icon={FileCheck2} />
        <StatCard label={t('incompleteSalesLabel')} value={incompleteSales.length} sub={RM(incompleteSales.reduce((s, o) => s + o.total, 0))} color={C.ochre} icon={Clock} />
        <StatCard label={t('completedSalesLabel')} value={completedSales.length} sub={RM(completedSales.reduce((s, o) => s + o.total, 0))} color={C.teal} icon={CheckCircle2} />
      </div>
      <SectionTitle eyebrow="Team Result" title={t('teamResultTitle')} />
      <div style={{ marginBottom: 24 }}><TeamChart team={team} orders={orders} accounts={accounts} /></div>

      <SectionTitle eyebrow="SO Issued" title={t('incompleteSalesTitle')} right={
        <Btn size="sm" variant="outline" icon={Receipt} onClick={() => setView('claim')}>{t('claimWizardTitle')}</Btn>
      } />
      <div style={{ marginBottom: 24 }}>
        {incompleteSales.length === 0 ? (
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 24, textAlign: 'center', color: C.sub, fontSize: 13 }}>{t('noIncompleteSales')}</div>
        ) : <OrderTable orders={incompleteSales} showAgent={false} />}
      </div>

      <SectionTitle eyebrow="SO Issued" title={t('completedSalesTitle')} />
      <div style={{ marginBottom: 24 }}>
        {completedSales.length === 0 ? (
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 24, textAlign: 'center', color: C.sub, fontSize: 13 }}>{t('noCompletedSales')}</div>
        ) : <OrderTable orders={completedSales} showAgent={false} />}
      </div>

      <SectionTitle eyebrow="My Orders" title={t('myOrdersTitle')} />
      <OrderTable orders={myOrders} showAgent={false} actions={o => {
        if (o.status === 'so_rejected') return <Btn size="sm" variant="outline" icon={Edit3} onClick={() => { setEditingOrder(o); setView('editOrder'); }}>{t('editResubmit')}</Btn>;
        if (o.status === 'so_opened') return <Btn size="sm" variant="outline" icon={RefreshCw} onClick={() => { setEditingOrder(o); setView('editOrder'); }}>{t('changeModel')}</Btn>;
        return null;
      }} />
    </div>
  );
}

function SlipPreview({ url, type, label, width = 180, height = 200 }) {
  const { t } = useLang();
  if (!url) return <div style={{ width, height: height * 0.7, border: `1px dashed ${C.line}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub, fontSize: 12 }}>{t('noPreview')}</div>;
  if (type && type.includes('pdf')) {
    return (
      <a href={url} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, width, height, border: `1px solid ${C.line}`, borderRadius: 8, background: '#fff', color: C.wood, textDecoration: 'none' }}>
        <FileText size={26} /><span style={{ fontSize: 12 }}>{t('openWord')} {label || 'PDF'}</span>
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img src={url} alt={label || 'slip'} style={{ width, maxHeight: height, objectFit: 'contain', borderRadius: 8, border: `1px solid ${C.line}`, background: '#fff' }} />
    </a>
  );
}

function ItemThumb({ item, size = 34 }) {
  return item.image ? (
    <img src={item.image} alt="" style={{ width: size, height: size, borderRadius: 6, objectFit: 'cover', border: `1px solid ${C.line}`, flexShrink: 0 }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: 6, background: C.woodTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Package size={Math.round(size * 0.45)} color={C.wood} />
    </div>
  );
}

function ItemLine({ line, items, onChange, onRemove, removable }) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const item = items.find(i => i.code === line.itemCode);
  const addOnsTotal = (item?.addOns || []).filter(a => line.addOnCodes.includes(a.code)).reduce((s, a) => s + a.price, 0);
  const lineTotal = item ? (item.price + addOnsTotal) * line.qty : 0;
  const toggleAddOn = (code) => {
    const has = line.addOnCodes.includes(code);
    onChange({ ...line, addOnCodes: has ? line.addOnCodes.filter(c => c !== code) : [...line.addOnCodes, code] });
  };
  const q = query.trim().toLowerCase();
  const matches = q === '' ? items : items.filter(i =>
    i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.color.toLowerCase().includes(q)
  );
  const selectItem = (it) => { onChange({ ...line, itemCode: it.code, addOnCodes: [] }); setQuery(''); setOpen(false); };

  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: 14, marginBottom: 10, background: '#FBFAF7' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 220px', position: 'relative' }}>
          <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('chooseModel')}</div>
          {item && !open ? (
            <div onClick={() => { setOpen(true); setQuery(''); }} style={{ ...inputStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <ItemThumb item={item} size={30} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.code} · {item.name}（{RM(item.price)}）</span>
              </span>
              <span style={{ color: C.wood, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('changeBtn')}</span>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <Search size={14} color={C.sub} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                autoFocus={open}
                style={{ ...inputStyle, paddingLeft: 32 }}
                placeholder={t('phSearchModel')}
                value={query}
                onFocus={() => setOpen(true)}
                onChange={e => { setQuery(e.target.value); setOpen(true); }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
              />
              {open && (
                <div style={{ position: 'absolute', zIndex: 20, top: '100%', left: 0, right: 0, marginTop: 4, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, boxShadow: '0 8px 20px rgba(35,36,32,0.12)', maxHeight: 260, overflowY: 'auto' }}>
                  {matches.length === 0 && <div style={{ padding: '12px 14px', fontSize: 12.5, color: C.sub }}>{t('noMatchingProduct')}</div>}
                  {matches.map(it => (
                    <div key={it.code} onMouseDown={() => selectItem(it)}
                      style={{ padding: '8px 14px', cursor: 'pointer', borderBottom: `1px solid ${C.line}`, fontSize: 13, display: 'flex', gap: 10, alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.woodTint)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <ItemThumb item={it} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontFamily: fontMono, fontWeight: 700, color: C.wood }}>{it.code}</span>
                          <span style={{ fontFamily: fontMono, fontSize: 12, flexShrink: 0 }}>{RM(it.price)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name} · {it.color}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ flex: '1 1 90px' }}>
          <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('qty')}</div>
          <input type="number" min={1} style={inputStyle} value={line.qty} onChange={e => onChange({ ...line, qty: Number(e.target.value) })} />
        </div>
        {removable && (
          <button onClick={onRemove} style={{ background: 'none', border: 'none', color: C.brick, cursor: 'pointer', padding: '9px 4px' }}><Trash2 size={16} /></button>
        )}
      </div>
      {item && item.addOns.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontFamily: fontBody, fontSize: 11.5, color: C.wood, marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {t('addOnSectionPlain')} <span style={{ color: C.brick, textTransform: 'none', letterSpacing: 0 }}>{t('addOnRequiredSuffix')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {item.addOns.map(a => (
              <label key={a.code} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.ink, cursor: 'pointer' }}>
                <input type="checkbox" checked={line.addOnCodes.includes(a.code)} onChange={() => toggleAddOn(a.code)} />
                {a.name} <span style={{ color: C.sub, fontFamily: fontMono }}>+{RM(a.price)}</span>
              </label>
            ))}
          </div>
          {line.addOnCodes.length === 0 && (
            <div style={{ fontSize: 11.5, color: C.brick, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertTriangle size={12} /> {t('addOnRequiredNote')}
            </div>
          )}
        </div>
      )}
      {item && (
        <div style={{ marginTop: 10, fontSize: 12.5, fontFamily: fontMono, color: C.wood, fontWeight: 700 }}>{t('subtotalLabel')} {RM(lineTotal)}</div>
      )}
    </div>
  );
}

function OrderForm({ user, items, accounts, editOrder, onCancel, onSubmit }) {
  const { t } = useLang();
  const [fullName, setFullName] = useState(editOrder?.customer || '');
  const [alamat, setAlamat] = useState(editOrder?.alamat || '');
  const [poscode, setPoscode] = useState(editOrder?.poscode || '');
  const [phone1, setPhone1] = useState(editOrder?.phone1 || '');
  const [phone2, setPhone2] = useState(editOrder?.phone2 || '');
  const [salesExecutive, setSalesExecutive] = useState(editOrder?.salesExecutive || user.name);
  const [salesmanPhone, setSalesmanPhone] = useState(editOrder?.salesmanPhone || '');
  const [lines, setLines] = useState(() =>
    editOrder ? editOrder.items.map((it, i) => ({ id: Date.now() + i, itemCode: it.code, qty: it.qty, addOnCodes: (it.addOns || []).map(a => a.code) })) : [{ id: 1, itemCode: '', qty: 1, addOnCodes: [] }]
  );
  const [amountOverride, setAmountOverride] = useState(editOrder?.amount ?? null);
  const [deliveryUrgent, setDeliveryUrgent] = useState(editOrder?.deliveryUrgent || false);
  const [logisticFile, setLogisticFile] = useState(editOrder?.logisticFile || null);
  const [logisticFileUrl, setLogisticFileUrl] = useState(editOrder?.logisticFileUrl || null);
  const [logisticFileType, setLogisticFileType] = useState(editOrder?.logisticFileType || '');
  const [remark, setRemark] = useState(editOrder?.remark || '');
  const [hasDeposit, setHasDeposit] = useState(!!(editOrder?.depositSlip || editOrder?.depositAmount != null));
  const [depositAmount, setDepositAmount] = useState(editOrder?.depositAmount ?? '');
  const [depositSlip, setDepositSlip] = useState(editOrder?.depositSlip || null);
  const [depositSlipUrl, setDepositSlipUrl] = useState(editOrder?.depositSlipUrl || null);
  const [depositSlipType, setDepositSlipType] = useState(editOrder?.depositSlipType || '');
  const [uploadingLogistic, setUploadingLogistic] = useState(false);
  const [uploadingDeposit, setUploadingDeposit] = useState(false);
  const [errors, setErrors] = useState([]);

  const lineDetail = (line) => {
    const item = items.find(i => i.code === line.itemCode);
    if (!item) return { item: null, addOns: [], lineTotal: 0 };
    const addOns = item.addOns.filter(a => line.addOnCodes.includes(a.code));
    const lineTotal = (item.price + addOns.reduce((s, a) => s + a.price, 0)) * line.qty;
    return { item, addOns, lineTotal };
  };
  const itemsTotal = lines.reduce((s, l) => s + lineDetail(l).lineTotal, 0);
  const amount = amountOverride !== null ? amountOverride : itemsTotal;

  const addLine = () => setLines(prev => [...prev, { id: Date.now(), itemCode: '', qty: 1, addOnCodes: [] }]);
  const removeLine = (id) => setLines(prev => prev.filter(l => l.id !== id));
  const updateLine = (id, next) => setLines(prev => prev.map(l => l.id === id ? next : l));

  const submit = () => {
    const errs = [];
    if (!fullName.trim()) errs.push(t('errFullNameRequired'));
    if (!alamat.trim()) errs.push(t('errAlamatRequired'));
    if (!/^\d{5}$/.test(poscode) || Number(poscode) < 50000 || Number(poscode) > 89990) errs.push(t('errPoscodeInvalid'));
    if (!phone1.trim()) errs.push(t('errPhone1Required'));
    if (!salesExecutive) errs.push(t('errSalesExecRequired'));
    if (!salesmanPhone.trim()) errs.push(t('errSalesmanPhoneRequired'));
    if (lines.some(l => !l.itemCode) || lines.length === 0) errs.push(t('errModelRequired'));
    if (lines.some(l => l.qty < 1)) errs.push(t('errQtyPositive'));
    lines.forEach((l, i) => {
      const it = items.find(x => x.code === l.itemCode);
      if (it && it.addOns.length > 0 && l.addOnCodes.length === 0) errs.push(t('errAddOnRequired', { n: i + 1, name: it.name }));
    });
    if (!amount || amount <= 0) errs.push(t('errAmountPositive'));
    if (deliveryUrgent && !logisticFile) errs.push(t('errLogisticRequired'));
    if (hasDeposit && !depositSlip) errs.push(t('errDepositSlipRequired2'));
    setErrors(errs);
    if (errs.length) return;

    const orderItems = lines.map(l => {
      const { item, addOns } = lineDetail(l);
      return { code: item.code, qty: l.qty, price: item.price, addOns: addOns.map(a => ({ code: a.code, name: a.name, price: a.price })) };
    });

    onSubmit({
      id: editOrder ? editOrder.id : `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: fullName, alamat, poscode, phone1, phone2,
      agent: user.name, team: user.team,
      salesExecutive, salesmanPhone,
      items: orderItems, amount, total: amount,
      deliveryUrgent,
      logisticFile: deliveryUrgent ? logisticFile : null,
      logisticFileUrl: deliveryUrgent ? logisticFileUrl : null,
      logisticFileType: deliveryUrgent ? logisticFileType : '',
      logisticStatus: deliveryUrgent ? (editOrder?.logisticStatus || 'pending') : null,
      remark, status: 'pending_so', soNumber: null, soFileUrl: null, soFileName: null,
      rejectReason: null,
      depositAmount: hasDeposit && depositAmount !== '' ? Number(depositAmount) : null,
      depositSlip: hasDeposit ? depositSlip : null,
      depositSlipUrl: hasDeposit ? depositSlipUrl : null,
      depositSlipType: hasDeposit ? depositSlipType : '',
      previousSoNumber: editOrder && editOrder.soNumber ? editOrder.soNumber : (editOrder?.previousSoNumber || null),
      date: editOrder ? editOrder.date : nowDateTime(),
      updatedAt: nowDateTime(),
    });
  };

  return (
    <div style={{ maxWidth: 620 }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', color: C.sub, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 14, fontSize: 13, fontFamily: fontBody }}>
        <ArrowLeft size={14} /> {t('backToDashboard')}
      </button>
      <SectionTitle eyebrow="Order Form" title={editOrder ? (editOrder.status === 'so_opened' ? t('changeModelTitle') : t('editResubmitTitle')) : t('newOrderTitle')} />
      {editOrder && editOrder.rejectReason && (
        <div style={{ background: C.brickTint, border: `1px solid ${C.brick}`, borderRadius: 8, padding: '12px 14px', marginBottom: 16, color: C.brick, fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4 }}><AlertTriangle size={14} /> {t('rejectReasonNotice')}</div>
          <div>{editOrder.rejectReason}</div>
        </div>
      )}
      {editOrder && editOrder.status === 'so_opened' && (
        <div style={{ background: C.woodTint, border: `1px solid ${C.wood}`, borderRadius: 8, padding: '12px 14px', marginBottom: 16, color: C.wood, fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <RefreshCw size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>{t('changeModelNoticePrefix')} <b style={{ fontFamily: fontMono }}>{editOrder.soNumber}</b> {t('changeModelNoticeSuffix')}</div>
        </div>
      )}
      {errors.length > 0 && (
        <div style={{ background: C.brickTint, border: `1px solid ${C.brick}`, borderRadius: 8, padding: '12px 14px', marginBottom: 16, color: C.brick, fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4 }}><AlertTriangle size={14} /> {t('incompleteInfo')}</div>
          <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.1em', color: C.wood, textTransform: 'uppercase', marginBottom: 12 }}>{t('customerInfo')}</div>
        <Field label="Full Name"><input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('phFullNameExample')} /></Field>
        <Field label={t('alamat')}><textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={alamat} onChange={e => setAlamat(e.target.value)} placeholder={t('phAlamatExample')} /></Field>
        <Field label={t('poscodeLabel')}>
          <input style={inputStyle} value={poscode} maxLength={5} inputMode="numeric"
            onChange={e => setPoscode(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder={t('phPoscodeExample')} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <Field label="No Phone 1"><input style={inputStyle} value={phone1} onChange={e => setPhone1(e.target.value)} placeholder="012-3456789" /></Field>
          <Field label={t('phone2')}><input style={inputStyle} value={phone2} onChange={e => setPhone2(e.target.value)} placeholder={t('phOptional')} /></Field>
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.1em', color: C.wood, textTransform: 'uppercase', marginBottom: 12 }}>{t('salesInfo')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <Field label="Sales Executive">
            <select style={inputStyle} value={salesExecutive} onChange={e => setSalesExecutive(e.target.value)}>
              {accounts.filter(a => a.role === 'salesman' && a.team === user.team).map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          </Field>
          <Field label="Salesman Phone Number"><input style={inputStyle} value={salesmanPhone} onChange={e => setSalesmanPhone(e.target.value)} placeholder="012-3456789" /></Field>
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.1em', color: C.wood, textTransform: 'uppercase', marginBottom: 12 }}>{t('itemSection')}</div>
        {lines.map(l => (
          <ItemLine key={l.id} line={l} items={items} onChange={next => updateLine(l.id, next)} onRemove={() => removeLine(l.id)} removable={lines.length > 1} />
        ))}
        <Btn size="sm" variant="outline" icon={Plus} onClick={addLine}>{t('addAnotherItem')}</Btn>

        <Field label={t('amountLabel')}>
          <input type="number" style={inputStyle} value={amount} onChange={e => setAmountOverride(e.target.value === '' ? 0 : Number(e.target.value))} />
        </Field>
        <div style={{ fontSize: 12, color: C.sub, marginTop: -8, marginBottom: 4 }}>
          {t('itemsTotalNote')}：{RM(itemsTotal)}
          {amountOverride !== null && amountOverride !== itemsTotal && (
            <button onClick={() => setAmountOverride(null)} style={{ marginLeft: 8, background: 'none', border: 'none', color: C.wood, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>{t('resetToItemsTotal')}</button>
          )}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: hasDeposit ? 14 : 0 }}>
          <input type="checkbox" checked={hasDeposit} onChange={e => setHasDeposit(e.target.checked)} />
          <Wallet size={16} color={C.wood} />
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t('depositSection')}</span>
          <span style={{ fontSize: 12, color: C.sub, fontWeight: 400 }}>{t('depositHint')}</span>
        </label>
        {hasDeposit && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <Field label={t('depositAmountLabel')}>
                <input type="number" style={inputStyle} value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder={t('phOptional')} />
              </Field>
              <div>
                <div style={{ fontFamily: fontBody, fontSize: 12.5, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('depositSlipLabel')}</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1.5px dashed ${C.line}`, borderRadius: 6, padding: '9px 12px', cursor: uploadingDeposit ? 'default' : 'pointer', background: '#fff' }}>
                  {uploadingDeposit ? <Loader2 size={16} color={C.wood} style={{ animation: 'spin 1s linear infinite' }} /> : <UploadCloud size={16} color={C.wood} />}
                  <span style={{ fontSize: 12.5, color: depositSlip ? C.ink : C.sub }}>{uploadingDeposit ? '…' : (depositSlip || t('depositUploadPlaceholder'))}</span>
                  <input type="file" accept="image/*,application/pdf" disabled={uploadingDeposit} style={{ display: 'none' }} onChange={async e => {
                    const f = e.target.files[0];
                    if (!f) return;
                    setUploadingDeposit(true);
                    try {
                      const url = await uploadToDrive(f, 'deposit_slip');
                      setDepositSlip(f.name); setDepositSlipUrl(url); setDepositSlipType(f.type);
                    } catch (err) {
                      alert(err.message);
                    }
                    setUploadingDeposit(false);
                  }} />
                </label>
              </div>
            </div>
            {!depositSlip && (
              <div style={{ fontSize: 11.5, color: C.brick, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertTriangle size={12} /> {t('depositSlipRequired')}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: deliveryUrgent ? 14 : 0 }}>
          <input type="checkbox" checked={deliveryUrgent} onChange={e => setDeliveryUrgent(e.target.checked)} />
          <Truck size={16} color={C.wood} />
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t('deliveryCheckbox')}</span>
        </label>
        {deliveryUrgent && (
          <div>
            <div style={{ fontSize: 12, color: C.sub, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageCircle size={13} /> {t('logisticNote')}
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: `1.5px dashed ${C.line}`, borderRadius: 8, padding: '22px 14px', cursor: uploadingLogistic ? 'default' : 'pointer', color: C.sub }}>
              {uploadingLogistic ? <Loader2 size={20} color={C.wood} style={{ animation: 'spin 1s linear infinite' }} /> : <UploadCloud size={20} color={C.wood} />}
              <span style={{ fontSize: 12.5 }}>{uploadingLogistic ? '…' : (logisticFile ? logisticFile : t('clickToSelectScreenshot'))}</span>
              <input type="file" accept="image/*" disabled={uploadingLogistic} style={{ display: 'none' }} onChange={async e => {
                const f = e.target.files[0];
                if (!f) return;
                setUploadingLogistic(true);
                try {
                  const url = await uploadToDrive(f, 'logistics_proof');
                  setLogisticFile(f.name);
                  setLogisticFileUrl(url);
                  setLogisticFileType(f.type);
                } catch (err) {
                  alert(err.message);
                }
                setUploadingLogistic(false);
              }} />
            </label>
          </div>
        )}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <Field label={t('remarkLabel')}><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={remark} onChange={e => setRemark(e.target.value)} placeholder={t('phRemarkExample')} /></Field>
      </div>

      <Btn icon={CheckCircle2} onClick={submit} disabled={uploadingDeposit || uploadingLogistic}>{editOrder ? t('resubmitToAdmin') : t('submitToAdmin')}</Btn>
    </div>
  );
}

/* ============================== 佣金申请流程 ============================== */
const GOOGLE_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1KQuqyD0kp4NzfXpny70B_uVQ4edVAthU?usp=drive_link';
function driveFolderName(date = new Date()) {
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `EE LIFE BANK SLIP (${month} ${date.getFullYear()})`;
}

function ClaimWizard({ user, orders, setView, onSubmit }) {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [method, setMethod] = useState('bank');
  const [slipFile, setSlipFile] = useState(null);
  const [slipExt, setSlipExt] = useState('jpg');
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [slipUrl, setSlipUrl] = useState(null);
  const [slipType, setSlipType] = useState('');
  const [slipAmount, setSlipAmount] = useState('');
  const [transferOk, setTransferOk] = useState(null);
  const eligible = orders.filter(o => o.agent === user.name && o.status === 'so_opened');
  const order = eligible.find(o => o.id === orderId);
  const claimAmount = order && slipAmount !== '' ? Number(slipAmount) - order.total : null;
  const driveFileName = order ? `${order.soNumber}.${slipExt}` : '';

  const submitClaim = () => {
    if (!order) return;
    onSubmit({
      id: `CM-${Math.floor(3000 + Math.random() * 900)}`,
      orderId: order.id,
      agent: user.name,
      team: user.team,
      method,
      slipFile,
      slipUrl,
      slipType,
      driveFileName,
      driveFolder: driveFolderName(),
      driveFolderUrl: GOOGLE_DRIVE_FOLDER_URL,
      slipAmount: Number(slipAmount) || 0,
      itemAmount: order.total,
      claimAmount: claimAmount || 0,
      transferVerified: !!transferOk,
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
    });
    setView('home');
  };

  const steps = [t('step1'), t('step2'), t('step3'), t('step4')];

  return (
    <div style={{ maxWidth: 560 }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: C.sub, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 14, fontSize: 13, fontFamily: fontBody }}>
        <ArrowLeft size={14} /> {t('backToDashboard')}
      </button>
      <SectionTitle eyebrow="Claim Commission" title={t('claimWizardTitle')} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 4, borderRadius: 2, background: step > i ? C.wood : C.line, marginBottom: 6 }} />
            <div style={{ fontSize: 11, color: step === i + 1 ? C.wood : C.sub, fontWeight: step === i + 1 ? 700 : 500 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, minHeight: 260 }}>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 10 }}>{t('chooseOrderHint')}</div>
            {eligible.length === 0 && <div style={{ color: C.sub, fontSize: 13 }}>{t('noEligibleOrders')}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {eligible.map(o => (
                <button key={o.id} onClick={() => setOrderId(o.id)}
                  style={{ textAlign: 'left', border: `1.5px solid ${orderId === o.id ? C.wood : C.line}`, background: orderId === o.id ? C.woodTint : '#fff', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fontMono, fontSize: 12.5 }}>
                    <span>{o.id} · {o.soNumber}</span><b>{RM(o.total)}</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{o.customer} · {o.items.map(it => it.code).join(', ')}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <Field label={t('paymentMethodLabel')}>
              {PAYMENT_METHODS.map(m => (
                <label key={m.code} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 4px', fontSize: 13.5, cursor: 'pointer' }}>
                  <input type="radio" name="method" checked={method === m.code} onChange={() => setMethod(m.code)} /> {t(m.key)}
                </label>
              ))}
            </Field>
          </div>
        )}
        {step === 3 && (
          <div>
            <Field label={t('uploadSlipLabel')}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: `1.5px dashed ${C.line}`, borderRadius: 8, padding: '26px 14px', cursor: uploadingSlip ? 'default' : 'pointer', color: C.sub }}>
                {uploadingSlip ? <Loader2 size={22} color={C.wood} style={{ animation: 'spin 1s linear infinite' }} /> : <UploadCloud size={22} color={C.wood} />}
                <span style={{ fontSize: 12.5 }}>{uploadingSlip ? '…' : (slipFile ? slipFile : t('clickToChooseFile'))}</span>
                <input type="file" disabled={uploadingSlip} style={{ display: 'none' }} onChange={async e => {
                  const f = e.target.files[0];
                  if (!f) return;
                  const ext = f.name.includes('.') ? f.name.split('.').pop().toLowerCase() : 'jpg';
                  setUploadingSlip(true);
                  try {
                    const url = await uploadToDrive(f, 'bank_slip');
                    setSlipFile(f.name); setSlipExt(ext);
                    setSlipUrl(url); setSlipType(f.type);
                    setTransferOk(true); setSlipAmount(String(order.total + 100));
                  } catch (err) {
                    alert(err.message);
                  }
                  setUploadingSlip(false);
                }} />
              </label>
            </Field>
          </div>
        )}
        {step === 4 && order && (
          <div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>{t('reviewAmountHint')}</div>
            <Field label={t('paymentAmountLabel')}>
              <input type="number" style={inputStyle} value={slipAmount} onChange={e => setSlipAmount(e.target.value)} />
            </Field>
            <div style={{ background: C.woodTint, borderRadius: 8, padding: '12px 14px', fontFamily: fontMono, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('paymentAmountRow')}</span><span>{RM(slipAmount || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span>{t('orderTotalRow')}</span><span>{RM(order.total)}</span></div>
            </div>
            <div style={{ fontSize: 11.5, color: C.sub, marginTop: 10 }}>{t('commissionHiddenNote')}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Btn variant="outline" icon={ChevronLeft} onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>{t('prev')}</Btn>
        {step < 4 && <Btn icon={ChevronRight} onClick={() => setStep(s => s + 1)} disabled={(step === 1 && !orderId) || (step === 3 && (!slipFile || uploadingSlip))}>{t('next')}</Btn>}
        {step === 4 && <Btn icon={CheckCircle2} onClick={submitClaim}>{t('submitToFinance')}</Btn>}
      </div>
    </div>
  );
}

/* ============================== Sales Team Leader ============================== */
function LeaderDashboard({ user, orders, claims, accounts }) {
  const { t } = useLang();
  const { teams } = useTeamsCtx();
  const team = teams[user.team];
  const teamOrders = orders.filter(o => o.team === user.team);
  const thisMonth = currentMonthKey();
  const total = teamOrders.filter(o => o.status === 'so_opened' && monthKey(o.date) === thisMonth).reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <SectionTitle eyebrow={user.leaderName ? `Team Leader · ${user.leaderName}` : 'Team Leader'} title={`${t('teamOverviewPrefix')} ${team.name}`} />
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label={t('statTeamTotal')} value={RM(total)} sub={`${t('ordersCountPrefix')} ${teamOrders.length} ${t('ordersCountSuffix')}`} icon={TrendingUp} />
      </div>
      <SectionTitle eyebrow="Team Result" title={t('teamResultDistribution')} />
      <div style={{ marginBottom: 24 }}><TeamChart team={team} orders={orders} accounts={accounts} /></div>

      <SectionTitle eyebrow="Team Orders" title={t('teamOrdersTitle')} />
      <OrderTable orders={teamOrders} />
    </div>
  );
}

/* ============================== Admin（开SO） ============================== */
function AdminOrderDetail({ order, onApproveLogistic, onRejectLogistic }) {
  const { t } = useLang();
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ flex: '2 1 320px' }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8 }}>{t('orderDetailsTitle')}</div>
        <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.9 }}>
          <div><b>{t('customerFullNameColon')}</b>{order.customer}</div>
          <div><b>Alamat：</b>{order.alamat || '—'}</div>
          <div><b>Poscode：</b>{order.poscode}　<b>{t('phoneColonPlain')}</b>{order.phone1 || '—'}{order.phone2 ? ` / ${order.phone2}` : ''}</div>
          <div><b>{t('submittedBy')}</b>{order.agent}　<b>Sales Executive：</b>{order.salesExecutive || order.agent}</div>
          <div><b>{t('salesmanPhoneLabel')}</b>{order.salesmanPhone || '—'}</div>
          <div><b>{t('itemsLabel')}</b>{order.items.map(it => `${it.code} x${it.qty}${it.addOns && it.addOns.length ? `（+${it.addOns.map(a => a.name).join(', ')}）` : ''}`).join('；')}</div>
          <div><b>{t('orderTotalLabel')}</b>{RM(order.total)}</div>
          {(order.depositSlip || order.depositAmount != null) && (
            <div><b>{t('depositLabel')}</b>{order.depositAmount != null ? RM(order.depositAmount) : t('amountUnfilled')}</div>
          )}
          <div><b>{t('soNumberColon')}</b>{order.soNumber || t('soNotIssuedYet')} {order.soFileUrl && <a href={order.soFileUrl} target="_blank" rel="noreferrer" style={{ color: C.wood, marginLeft: 6 }}>{t('viewSoPdf')}</a>}</div>
          {order.previousSoNumber && !order.soNumber && (
            <div style={{ color: C.wood, display: 'flex', alignItems: 'flex-start', gap: 5, marginTop: 2 }}>
              <RefreshCw size={13} style={{ flexShrink: 0, marginTop: 2 }} /><span><b>{t('changeModelResubmitLabel')}</b>{t('changeModelResubmitPrefix')} {order.previousSoNumber} {t('changeModelResubmitSuffix')}</span>
            </div>
          )}
          {order.status === 'so_rejected' && (
            <div style={{ color: C.brick, display: 'flex', alignItems: 'flex-start', gap: 5, marginTop: 2 }}>
              <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2 }} /><span><b>{t('rejectReasonColon')}</b>{order.rejectReason || t('unnamedReason')}</span>
            </div>
          )}
          {order.remark && <div><b>{t('remarkColon')}</b>{order.remark}</div>}
        </div>
      </div>

      {(order.depositSlip || order.depositAmount != null) && (
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Wallet size={13} /> {t('depositApproval')}
          </div>
          <SlipPreview url={order.depositSlipUrl} type={order.depositSlipType} label={t('depositSlipWord')} width={180} height={200} />
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 6 }}>{order.depositSlip || t('noFilePreview')}</div>
          <div style={{ fontSize: 12.5, color: C.wood, fontWeight: 700, marginTop: 4, fontFamily: fontMono }}>{order.depositAmount != null ? RM(order.depositAmount) : t('amountUnfilled')}</div>
        </div>
      )}

      {order.deliveryUrgent && (
        <div style={{ flex: '1 1 220px' }}>
          <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Truck size={13} /> {t('deliveryApprovalTitle')}
          </div>
          {order.logisticFileUrl ? (
            order.logisticFileType && order.logisticFileType.includes('pdf') ? (
              <a href={order.logisticFileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, width: 180, height: 160, border: `1px solid ${C.line}`, borderRadius: 8, background: '#fff', color: C.wood, textDecoration: 'none' }}>
                <FileText size={26} /><span style={{ fontSize: 12 }}>{t('openFile')}</span>
              </a>
            ) : (
              <a href={order.logisticFileUrl} target="_blank" rel="noreferrer">
                <img src={order.logisticFileUrl} alt="logistic approval" style={{ width: 180, maxHeight: 220, objectFit: 'contain', borderRadius: 8, border: `1px solid ${C.line}`, background: '#fff' }} />
              </a>
            )
          ) : (
            <div style={{ width: 180, height: 120, border: `1px dashed ${C.line}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub, fontSize: 12, textAlign: 'center', padding: 8 }}>
              <MessageCircle size={16} style={{ marginRight: 4 }} /> {order.logisticFile || t('noScreenshotPreview')}
            </div>
          )}
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <StampBadge status={order.logisticStatus === 'approved' ? 'verified' : order.logisticStatus === 'rejected' ? 'rejected' : 'pending'} />
          </div>
          {order.logisticStatus === 'pending' && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <Btn size="sm" variant="teal" icon={CheckCircle2} onClick={onApproveLogistic}>{t('approve')}</Btn>
              <Btn size="sm" variant="brick" icon={XCircle} onClick={onRejectLogistic}>{t('reject')}</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ orders, setOrders, items, setItems }) {
  const { t } = useLang();
  const [tab, setTab] = useState('orders');
  const [openingId, setOpeningId] = useState(null);
  const [soNumber, setSoNumber] = useState('');
  const [soFile, setSoFile] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const pending = orders.filter(o => o.status === 'pending_so');
  const opened = orders.filter(o => o.status === 'so_opened');
  const rejectedOrders = orders.filter(o => o.status === 'so_rejected');
  const pendingLogistics = orders.filter(o => o.deliveryUrgent && o.logisticStatus === 'pending').length;

  const startOpen = (o) => {
    setOpeningId(o.id);
    setSoNumber(`SO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 90) + 10)}`);
    setSoFile(null);
  };

  const confirmOpen = (id) => {
    if (!soNumber.trim() || !soFile) return;
    const soFileUrl = URL.createObjectURL(soFile);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'so_opened', soNumber, soFileUrl, soFileName: soFile.name } : o));
    setOpeningId(null); setSoNumber(''); setSoFile(null);
  };

  const startReject = (o) => { setRejectingId(o.id); setRejectReason(''); };
  const confirmReject = (id) => {
    if (!rejectReason.trim()) return;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'so_rejected', rejectReason, soNumber: null } : o));
    setRejectingId(null); setRejectReason('');
  };
  const reopenOrder = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'pending_so', rejectReason: null } : o));

  const toggleDetail = (id) => setDetailId(prev => prev === id ? null : id);
  const setLogisticStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, logisticStatus: status } : o));

  return (
    <div>
      <SectionTitle eyebrow="Admin" title={tab === 'orders' ? t('pendingSoOrders') : t('adminTabItems')} right={
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['orders', t('adminTabOrders')], ['items', t('adminTabItems')]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '7px 14px', borderRadius: 7, border: `1px solid ${tab === id ? C.wood : C.line}`,
              background: tab === id ? C.wood : '#fff', color: tab === id ? '#fff' : C.ink, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: fontBody,
            }}>{l}</button>
          ))}
        </div>
      } />

      {tab === 'items' && <ItemsManager items={items} setItems={setItems} />}

      {tab === 'orders' && (
        <>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label={t('statPendingSo')} value={pending.length} color={C.ochre} icon={Clock} />
        <StatCard label={t('statSoThisMonth')} value={opened.length} color={C.teal} icon={FileCheck2} />
        <StatCard label={t('statPendingLogistics')} value={pendingLogistics} color={C.brick} icon={Truck} />
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 28 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
          <thead><tr style={{ background: C.woodTint }}>
            <th style={th}>{t('orderIdCol')}</th><th style={th}>{t('customerCol')}</th><th style={th}>{t('agentCol')}</th><th style={th}>POS Code</th><th style={th}>{t('amountCol')}</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {pending.length === 0 && <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: C.sub, padding: 30 }}>
              <Inbox size={20} style={{ marginBottom: 6 }} /><div>{t('noPendingSo')}</div></td></tr>}
            {pending.map(o => (
              <React.Fragment key={o.id}>
                <tr style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ ...td, fontFamily: fontMono }}>{o.id}{o.previousSoNumber && <div style={{ fontSize: 10, color: C.wood, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}><RefreshCw size={10} /> {t('changeModelTag')}</div>}</td>
                  <td style={td}>{o.customer}{o.deliveryUrgent && <div style={{ marginTop: 3 }}><StampBadge status={o.logisticStatus === 'approved' ? 'verified' : o.logisticStatus === 'rejected' ? 'rejected' : 'pending'} /></div>}</td>
                  <td style={td}>{o.agent}</td>
                  <td style={{ ...td, fontFamily: fontMono, fontSize: 12 }}>{o.poscode}</td>
                  <td style={{ ...td, fontFamily: fontMono, fontWeight: 600 }}>{RM(o.total)}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn size="sm" variant="outline" icon={Eye} onClick={() => toggleDetail(o.id)}>{detailId === o.id ? t('collapse') : t('detail')}</Btn>
                      {openingId !== o.id && rejectingId !== o.id && (
                        <>
                          <Btn size="sm" variant="outline" icon={Stamp} onClick={() => startOpen(o)}>{t('openSo')}</Btn>
                          <Btn size="sm" variant="brick" icon={XCircle} onClick={() => startReject(o)}>{t('reject')}</Btn>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {detailId === o.id && (
                  <tr style={{ borderTop: `1px solid ${C.line}`, background: '#FBFAF7' }}>
                    <td colSpan={6} style={{ padding: 18 }}>
                      <AdminOrderDetail order={o} onApproveLogistic={() => setLogisticStatus(o.id, 'approved')} onRejectLogistic={() => setLogisticStatus(o.id, 'rejected')} />
                    </td>
                  </tr>
                )}
                {rejectingId === o.id && (
                  <tr style={{ borderTop: `1px solid ${C.line}`, background: C.brickTint }}>
                    <td colSpan={6} style={{ ...td, padding: 16 }}>
                      <div style={{ fontFamily: fontBody, fontSize: 12, color: C.brick, marginBottom: 6, fontWeight: 600 }}>{t('rejectReasonPrompt')}</div>
                      <textarea autoFocus style={{ ...inputStyle, minHeight: 60, resize: 'vertical', marginBottom: 10 }} placeholder={t('rejectReasonPlaceholder')} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn size="sm" variant="brick" icon={XCircle} disabled={!rejectReason.trim()} onClick={() => confirmReject(o.id)}>{t('confirmReject')}</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => setRejectingId(null)}>{t('cancel')}</Btn>
                      </div>
                    </td>
                  </tr>
                )}
                {openingId === o.id && (
                  <tr style={{ borderTop: `1px solid ${C.line}`, background: C.woodTint }}>
                    <td colSpan={6} style={{ ...td, padding: 16 }}>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 200px' }}>
                          <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('soNumberLabel')}</div>
                          <input autoFocus style={inputStyle} value={soNumber} onChange={e => setSoNumber(e.target.value)} />
                        </div>
                        <div style={{ flex: '1 1 240px' }}>
                          <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('uploadSoPdf')}</div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1.5px dashed ${C.wood}`, borderRadius: 6, padding: '8px 12px', cursor: 'pointer', background: '#fff' }}>
                            <UploadCloud size={16} color={C.wood} />
                            <span style={{ fontSize: 12.5, color: soFile ? C.ink : C.sub }}>{soFile ? soFile.name : t('chooseSoPdf')}</span>
                            <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setSoFile(e.target.files[0] || null)} />
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn size="sm" icon={Stamp} disabled={!soNumber.trim() || !soFile} onClick={() => confirmOpen(o.id)}>{t('confirmOpenSo')}</Btn>
                          <Btn size="sm" variant="ghost" onClick={() => setOpeningId(null)}>{t('cancel')}</Btn>
                        </div>
                      </div>
                      {!soFile && <div style={{ fontSize: 11.5, color: C.brick, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={12} /> {t('soPdfRequiredNote')}</div>}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle eyebrow="ORDER" title={t('archivedOrders')} />
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
          <thead><tr style={{ background: C.woodTint }}>
            <th style={th}>{t('orderIdCol')}</th><th style={th}>{t('customerCol')}</th><th style={th}>{t('agentCol')}</th><th style={th}>{t('amountCol')}</th><th style={th}>{t('soFileCol')}</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {opened.length === 0 && <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: C.sub, padding: 30 }}>{t('noRecords')}</td></tr>}
            {opened.map(o => (
              <React.Fragment key={o.id}>
                <tr style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ ...td, fontFamily: fontMono }}>{o.id}<div style={{ fontSize: 10.5, color: C.teal }}>{o.soNumber}</div></td>
                  <td style={td}>{o.customer}{o.deliveryUrgent && <div style={{ marginTop: 3 }}><StampBadge status={o.logisticStatus === 'approved' ? 'verified' : o.logisticStatus === 'rejected' ? 'rejected' : 'pending'} /></div>}</td>
                  <td style={td}>{o.agent}</td>
                  <td style={{ ...td, fontFamily: fontMono, fontWeight: 600 }}>{RM(o.total)}</td>
                  <td style={td}>
                    {o.soFileUrl ? (
                      <a href={o.soFileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: C.wood, fontWeight: 600, fontSize: 12.5, textDecoration: 'none' }}>
                        <FileText size={14} /> {o.soFileName || 'SO.pdf'}
                      </a>
                    ) : <span style={{ color: C.sub, fontSize: 12 }}>—</span>}
                  </td>
                  <td style={td}><Btn size="sm" variant="outline" icon={Eye} onClick={() => toggleDetail(o.id)}>{detailId === o.id ? t('collapse') : t('detail')}</Btn></td>
                </tr>
                {detailId === o.id && (
                  <tr style={{ borderTop: `1px solid ${C.line}`, background: '#FBFAF7' }}>
                    <td colSpan={6} style={{ padding: 18 }}>
                      <AdminOrderDetail order={o} onApproveLogistic={() => setLogisticStatus(o.id, 'approved')} onRejectLogistic={() => setLogisticStatus(o.id, 'rejected')} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {rejectedOrders.length > 0 && (
        <>
          <SectionTitle eyebrow="Rejected" title={t('rejectedOrdersTitle')} />
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
              <thead><tr style={{ background: C.woodTint }}>
                <th style={th}>{t('orderIdCol')}</th><th style={th}>{t('customerCol')}</th><th style={th}>{t('agentCol')}</th><th style={th}>{t('rejectReasonCol')}</th><th style={th}></th>
              </tr></thead>
              <tbody>
                {rejectedOrders.map(o => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td style={{ ...td, fontFamily: fontMono }}>{o.id}</td>
                    <td style={td}>{o.customer}</td>
                    <td style={td}>{o.agent}</td>
                    <td style={{ ...td, fontSize: 12.5, color: C.brick }}>{o.rejectReason}</td>
                    <td style={td}><Btn size="sm" variant="outline" icon={Stamp} onClick={() => reopenOrder(o.id)}>{t('reopenReview')}</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
}
function AccountsManager({ accounts, setAccounts }) {
  const { t } = useLang();
  const { teams, setTeams } = useTeamsCtx();
  const [creatingRole, setCreatingRole] = useState(null);
  const [creatingBusy, setCreatingBusy] = useState(false);
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resettingId, setResettingId] = useState(null);
  const [resetValue, setResetValue] = useState('');

  const startCreate = (role) => { setCreatingRole(role); setName(''); setTeam(''); setTeamNameInput(''); setPassword(''); setError(''); };

  const submitCreate = async () => {
    if (!password.trim() || password.length < 6) { setError(t('passwordTooShort')); return; }
    let payload = null;
    if (creatingRole === 'salesman') {
      if (!name.trim()) { setError(t('accountName')); return; }
      if (!team) { setError(t('chooseTeam')); return; }
      const dup = accounts.some(a => a.role === 'salesman' && a.name.trim().toLowerCase() === name.trim().toLowerCase());
      if (dup) { setError(t('errSalesmanNameDuplicate', { name: name.trim() })); return; }
      payload = { role: 'salesman', name: name.trim(), team, password };
    } else if (creatingRole === 'leader') {
      const typedName = teamNameInput.trim();
      if (!typedName) { setError(t('accountTeam')); return; }
      const existing = Object.values(teams).find(tm => tm.name.trim().toLowerCase() === typedName.toLowerCase());
      let teamId;
      if (existing) {
        const already = accounts.some(a => a.role === 'leader' && a.team === existing.id);
        if (already) { setError(t('errTeamHasLeader', { name: typedName })); return; }
        teamId = existing.id;
      } else {
        teamId = `team_${Date.now()}`;
        setTeams(prev => ({ ...prev, [teamId]: { id: teamId, name: typedName, leader: null, members: [] } }));
      }
      payload = { role: 'leader', team: teamId, password };
    } else if (creatingRole === 'admin') {
      if (!name.trim()) { setError(t('accountName')); return; }
      payload = { role: 'admin', name: name.trim(), password };
    }
    if (!payload) return;
    setCreatingBusy(true);
    const { data, error: fnError } = await supabase.functions.invoke('accounts-admin', { body: { action: 'create', ...payload } });
    setCreatingBusy(false);
    if (fnError || data?.error) { setError((data && data.error) || fnError.message); return; }
    setAccounts(prev => [...prev, accountRowToApp(data)]);
    setCreatingRole(null);
  };

  const [resetError, setResetError] = useState('');
  const confirmReset = async (id) => {
    if (!resetValue.trim() || resetValue.length < 6) { setResetError(t('passwordTooShort')); return; }
    const { data, error: fnError } = await supabase.functions.invoke('accounts-admin', { body: { action: 'resetPassword', userId: id, newPassword: resetValue } });
    if (fnError || data?.error) { setResetError((data && data.error) || fnError.message); return; }
    setResetError(''); setResettingId(null); setResetValue('');
  };
  const deleteAccount = async (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    await supabase.functions.invoke('accounts-admin', { body: { action: 'delete', userId: id } });
  };

  const roleLabel = (r) => ({ salesman: t('role_salesman'), leader: t('role_leader'), admin: t('role_admin'), finance: t('role_finance') }[r] || r);
  const nameTeamLabel = (a) => a.role === 'leader' ? (teams[a.team]?.leader ? `${teams[a.team]?.name} (${teams[a.team].leader})` : teams[a.team]?.name) : a.role === 'salesman' ? `${a.name} · ${teams[a.team]?.name}` : a.name;

  return (
    <div>
      <div style={{ background: C.woodTint, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: C.wood, marginBottom: 16 }}>
        {t('accountsIntro')}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['salesman', 'leader', 'admin'].map(r => (
          <Btn key={r} size="sm" variant="outline" icon={Plus} onClick={() => startCreate(r)}>{t('createAccount')} · {roleLabel(r)}</Btn>
        ))}
      </div>

      {creatingRole && (
        <div style={{ background: C.woodTint, border: `1px solid ${C.wood}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 10 }}>{t('createAccount')} · {roleLabel(creatingRole)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 10 }}>
            {creatingRole === 'salesman' && (
              <>
                <div>
                  <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('accountName')}</div>
                  <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amy Tan" />
                </div>
                <div>
                  <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('accountTeam')}</div>
                  <select style={inputStyle} value={team} onChange={e => setTeam(e.target.value)}>
                    <option value="">{t('chooseTeam')}</option>
                    {Object.values(teams).map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                  </select>
                </div>
              </>
            )}
            {creatingRole === 'leader' && (
              <div>
                <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('accountTeam')}</div>
                <input style={inputStyle} value={teamNameInput} onChange={e => setTeamNameInput(e.target.value)} placeholder="e.g. Howly Home" list="existing-teams" />
                <datalist id="existing-teams">
                  {Object.values(teams).map(tm => <option key={tm.id} value={tm.name} />)}
                </datalist>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{t('teamNameReuseNote')}</div>
              </div>
            )}
            {creatingRole === 'admin' && (
              <div>
                <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('accountName')}</div>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('accountPassword')}</div>
              <input style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          {error && <div style={{ color: C.brick, fontSize: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={13} /> {error}</div>}
          <div style={{ display: 'flex', gap: 6 }}>
            <Btn size="sm" icon={CheckCircle2} onClick={submitCreate} disabled={creatingBusy}>{creatingBusy ? '…' : t('create')}</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setCreatingRole(null)}>{t('cancel')}</Btn>
          </div>
        </div>
      )}

      <SectionTitle title={t('accountsListTitle')} />
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
          <thead><tr style={{ background: C.woodTint }}>
            <th style={th}>{t('colRole')}</th><th style={th}>{t('colNameTeam')}</th><th style={th}>{t('colPassword')}</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {accounts.length === 0 && <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: C.sub, padding: 30 }}>{t('noAccountsYet')}</td></tr>}
            {accounts.map(a => (
              <tr key={a.id} style={{ borderTop: `1px solid ${C.line}` }}>
                <td style={td}>{roleLabel(a.role)}</td>
                <td style={td}>{nameTeamLabel(a)}</td>
                <td style={{ ...td, fontFamily: fontMono }}>
                  {resettingId === a.id ? (
                    <div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input autoFocus style={{ ...inputStyle, width: 110, padding: '6px 8px' }} value={resetValue} onChange={e => { setResetValue(e.target.value); setResetError(''); }} />
                        <Btn size="sm" icon={CheckCircle2} onClick={() => confirmReset(a.id)}>{t('save')}</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => { setResettingId(null); setResetError(''); }}>{t('cancel')}</Btn>
                      </div>
                      {resetError && <div style={{ color: C.brick, fontSize: 11, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11} /> {resetError}</div>}
                    </div>
                  ) : '••••••'}
                </td>
                <td style={td}>
                  {resettingId !== a.id && a.role !== 'finance' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn size="sm" variant="outline" icon={Lock} onClick={() => { setResettingId(a.id); setResetValue(''); }}>{t('resetPassword')}</Btn>
                      <Btn size="sm" variant="brick" icon={Trash2} onClick={() => deleteAccount(a.id)}>{t('delete')}</Btn>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemsManager({ items, setItems }) {
  const { t } = useLang();
  const [editingItem, setEditingItem] = useState(null);
  const [addingItem, setAddingItem] = useState(false);

  const saveItem = (draft) => {
    setItems(prev => prev.some(i => i.id === draft.id) ? prev.map(i => i.id === draft.id ? draft : i) : [...prev, { ...draft, id: Date.now() }]);
    setEditingItem(null); setAddingItem(false);
  };
  const deleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Btn icon={Plus} onClick={() => setAddingItem(true)}>{t('itemsManageAddNew')}</Btn>
      </div>
      {addingItem && <ItemEditor item={{ id: null, code: '', name: '', price: 0, stock: 0, color: '', category: '', image: null, addOns: [] }} existingItems={items} onSave={saveItem} onCancel={() => setAddingItem(false)} />}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
          <thead><tr style={{ background: C.woodTint }}>
            <th style={th}>{t('colImage')}</th><th style={th}>{t('colCode')}</th><th style={th}>{t('colProduct')}</th><th style={th}>{t('colPrice')}</th><th style={th}>{t('colStock')}</th><th style={th}>{t('colColor')}</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {items.map(it => editingItem === it.id ? (
              <tr key={it.id}><td colSpan={7} style={{ padding: 12 }}><ItemEditor item={it} existingItems={items} onSave={saveItem} onCancel={() => setEditingItem(null)} /></td></tr>
            ) : (
              <tr key={it.id} style={{ borderTop: `1px solid ${C.line}` }}>
                <td style={td}>
                  {it.image ? (
                    <img src={it.image} alt="" style={{ width: 42, height: 42, borderRadius: 6, objectFit: 'cover', border: `1px solid ${C.line}` }} />
                  ) : (
                    <div style={{ width: 42, height: 42, borderRadius: 6, background: C.woodTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={16} color={C.wood} />
                    </div>
                  )}
                </td>
                <td style={{ ...td, fontFamily: fontMono }}>{it.code}</td>
                <td style={td}>{it.name}<div style={{ fontSize: 11, color: C.sub }}>{it.category}</div></td>
                <td style={{ ...td, fontFamily: fontMono }}>{RM(it.price)}</td>
                <td style={td}>{it.stock}</td>
                <td style={{ ...td, fontSize: 12 }}>{it.color}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditingItem(it.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.wood }}><Edit3 size={15} /></button>
                    <button onClick={() => deleteItem(it.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.brick }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FinanceDashboard({ orders, claims, setClaims, items, setItems, accounts, setAccounts }) {
  const { t } = useLang();
  const { teams } = useTeamsCtx();
  const [tab, setTab] = useState('commission');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter);
  const teamSales = Object.values(teams).map(tm => ({
    team: tm.name,
    total: orders.filter(o => o.team === tm.id && o.status === 'so_opened').reduce((s, o) => s + o.total, 0),
    count: orders.filter(o => o.team === tm.id && o.status === 'so_opened').length,
  }));

  const setStatus = (id, status) => setClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c));

  return (
    <div>
      <SectionTitle eyebrow={t('financeEyebrow')} title={t('financeConsoleTitle')} right={
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['commission', t('tabCommission')], ['sales', t('tabTeamSales')], ['items', t('tabItemsManage')], ['accounts', t('tabAccounts')]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '7px 14px', borderRadius: 7, border: `1px solid ${tab === id ? C.wood : C.line}`,
              background: tab === id ? C.wood : '#fff', color: tab === id ? '#fff' : C.ink, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: fontBody,
            }}>{l}</button>
          ))}
        </div>
      } />

      {tab === 'accounts' && <AccountsManager accounts={accounts} setAccounts={setAccounts} />}

      {tab === 'commission' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['all', 'pending', 'verified', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontSize: 12, padding: '6px 12px', borderRadius: 20, border: `1px solid ${filter === f ? C.wood : C.line}`,
                background: filter === f ? C.woodTint : '#fff', color: filter === f ? C.wood : C.sub, cursor: 'pointer', fontFamily: fontBody, fontWeight: 600,
              }}>{{ all: t('filterAll'), pending: t('filterPending'), verified: t('filterVerified'), rejected: t('filterRejected') }[f]}</button>
            ))}
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontBody, fontSize: 13 }}>
              <thead><tr style={{ background: C.woodTint }}>
                <th style={th}>{t('colClaimId')}</th><th style={th}>{t('colOrder')}</th><th style={th}>{t('agentCol')}</th><th style={th}>{t('step2')}</th><th style={th}>{t('colSlipCheck')}</th><th style={th}>{t('colDriveFile')}</th><th style={th}>{t('colClaimAmount')}</th><th style={th}>{t('statusCol')}</th><th style={th}></th>
              </tr></thead>
              <tbody>
                {filtered.map(c => {
                  const order = orders.find(o => o.id === c.orderId);
                  const isOpen = expandedId === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <tr style={{ borderTop: `1px solid ${C.line}` }}>
                        <td style={{ ...td, fontFamily: fontMono }}>{c.id}</td>
                        <td style={{ ...td, fontFamily: fontMono, fontSize: 12 }}>{c.orderId}</td>
                        <td style={td}>{c.agent}</td>
                        <td style={{ ...td, fontSize: 12 }}>{t((PAYMENT_METHODS.find(m => m.code === c.method) || {}).key) || c.method}</td>
                        <td style={td}>{c.transferVerified ? <span style={{ color: C.teal, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><ShieldCheck size={13} /> {t('payeeConfirmed')}</span> : <span style={{ color: C.brick, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><AlertTriangle size={13} /> {t('payeeMismatch')}</span>}</td>
                        <td style={td}>
                          {c.driveFileName ? (
                            <div style={{ fontSize: 11.5, color: C.wood }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: fontMono, fontWeight: 700 }}><FileText size={12} /> {c.driveFileName}</div>
                              <a href={c.driveFolderUrl || GOOGLE_DRIVE_FOLDER_URL} target="_blank" rel="noreferrer" style={{ color: C.sub, marginTop: 2, textDecoration: 'underline', display: 'block' }}>{c.driveFolder}</a>
                            </div>
                          ) : <span style={{ color: C.sub, fontSize: 12 }}>—</span>}
                        </td>
                        <td style={{ ...td, fontFamily: fontMono, fontWeight: 600 }}>{RM(c.claimAmount)}</td>
                        <td style={td}><StampBadge status={c.status} /></td>
                        <td style={td}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Btn size="sm" variant="outline" icon={Eye} onClick={() => setExpandedId(isOpen ? null : c.id)}>{isOpen ? t('collapse') : t('view')}</Btn>
                            {c.status === 'pending' && (
                              <>
                                <Btn size="sm" variant="teal" icon={CheckCircle2} onClick={() => setStatus(c.id, 'verified')}>{t('verify')}</Btn>
                                <Btn size="sm" variant="brick" icon={XCircle} onClick={() => setStatus(c.id, 'rejected')}>{t('reject')}</Btn>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr style={{ borderTop: `1px solid ${C.line}`, background: '#FBFAF7' }}>
                          <td colSpan={9} style={{ padding: 18 }}>
                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                              <div style={{ flex: '1 1 200px' }}>
                                <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8 }}>{t('bankSlipTitle')}</div>
                                <SlipPreview url={c.slipUrl} type={c.slipType} label={t('bankSlipWord')} width={180} height={220} />
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 6 }}>{c.slipFile}</div>
                                <div style={{ fontSize: 12, color: C.ink, marginTop: 4, fontFamily: fontMono }}>{RM(c.slipAmount)}</div>
                              </div>

                              {order && (order.depositSlipUrl || order.depositAmount != null) && (
                                <div style={{ flex: '1 1 200px' }}>
                                  <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8 }}>{t('depositSlipTitle')}</div>
                                  <SlipPreview url={order.depositSlipUrl} type={order.depositSlipType} label={t('depositSlipWord')} width={180} height={220} />
                                  <div style={{ fontSize: 11.5, color: C.sub, marginTop: 6 }}>{order.depositSlip}</div>
                                  <div style={{ fontSize: 12, color: C.ink, marginTop: 4, fontFamily: fontMono }}>{order.depositAmount != null ? RM(order.depositAmount) : t('amountUnfilled')}</div>
                                </div>
                              )}

                              <div style={{ flex: '2 1 320px' }}>
                                <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8 }}>{t('orderDetailsTitle')}</div>
                                {order ? (
                                  <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.9 }}>
                                    <div><b>{t('customerFullNameColon')}</b>{order.customer}</div>
                                    <div><b>Alamat：</b>{order.alamat || '—'}</div>
                                    <div><b>Poscode：</b>{order.poscode}　<b>{t('phoneColonPlain')}</b>{order.phone1}{order.phone2 ? ` / ${order.phone2}` : ''}</div>
                                    <div><b>Sales Executive：</b>{order.salesExecutive || order.agent}　<b>{t('salesmanPhoneLabel')}</b>{order.salesmanPhone || '—'}</div>
                                    <div><b>{t('itemsLabel')}</b>{order.items.map(it => `${it.code} x${it.qty}${it.addOns && it.addOns.length ? `（+${it.addOns.map(a => a.name).join(', ')}）` : ''}`).join('；')}</div>
                                    <div><b>{t('orderTotalColonPlain')}</b>{RM(order.total)}</div>
                                    <div><b>{t('soNumberColon')}</b>{order.soNumber || '—'} {order.soFileUrl && <a href={order.soFileUrl} target="_blank" rel="noreferrer" style={{ color: C.wood, marginLeft: 6 }}>{t('viewSoPdf')}</a>}</div>
                                    {order.remark && <div><b>{t('remarkColonPlain')}</b>{order.remark}</div>}
                                    <div style={{ background: C.woodTint, borderRadius: 6, padding: '8px 10px', marginTop: 8, fontFamily: fontMono, fontSize: 12 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('totalCheckDeposit')}</span><span>{order.depositAmount != null ? RM(order.depositAmount) : '—'}</span></div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('totalCheckSlip')}</span><span>{RM(c.slipAmount)}</span></div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px dashed ${C.wood}`, marginTop: 4, paddingTop: 4, fontWeight: 700 }}>
                                        <span>{t('totalCheckReceived')}</span><span>{RM((order.depositAmount || 0) + (c.slipAmount || 0))}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', color: C.sub }}><span>{t('totalCheckOrderTotal')}</span><span>{RM(order.total)}</span></div>
                                    </div>
                                  </div>
                                ) : <div style={{ fontSize: 12.5, color: C.sub }}>{t('orderNotFound')}</div>}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {teamSales.map(row => (
            <div key={row.team} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 600 }}>{row.team}</div>
                <div style={{ fontSize: 12.5, color: C.sub }}>{row.count} {t('teamSalesCount')}</div>
              </div>
              <div style={{ fontFamily: fontMono, fontSize: 20, fontWeight: 700, color: C.wood }}>{RM(row.total)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'items' && <ItemsManager items={items} setItems={setItems} />}
    </div>
  );
}

function ItemEditor({ item, existingItems = [], onSave, onCancel }) {
  const { t } = useLang();
  const [d, setD] = useState({ addOns: [], image: null, ...item });
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const path = `${Date.now()}_${Math.floor(Math.random() * 9999)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('item-images').upload(path, file);
    setUploadingImage(false);
    if (uploadError) { setError(uploadError.message); return; }
    const { data: pub } = supabase.storage.from('item-images').getPublicUrl(path);
    setD(prev => ({ ...prev, image: pub.publicUrl }));
  };

  const addAddOn = () => setD({ ...d, addOns: [...d.addOns, { code: `AO-${Math.floor(Math.random() * 900 + 100)}`, name: '', price: 0, stock: 0 }] });
  const updateAddOn = (i, patch) => setD({ ...d, addOns: d.addOns.map((a, idx) => idx === i ? { ...a, ...patch } : a) });
  const removeAddOn = (i) => setD({ ...d, addOns: d.addOns.filter((_, idx) => idx !== i) });

  const handleSave = () => {
    if (!d.image) { setError(t('errImageRequired')); return; }
    if (!d.code.trim() || !d.name.trim()) { setError(t('errCodeNameRequired')); return; }
    if (!d.price || Number(d.price) <= 0) { setError(t('errPriceZero')); return; }
    if (!d.stock || Number(d.stock) <= 0) { setError(t('errStockZero')); return; }
    if (!d.category) { setError(t('errCategoryRequired')); return; }
    const badAddOn = d.addOns.find(a => a.price == null || a.price === '' || Number(a.price) < 0 || !a.stock || Number(a.stock) <= 0);
    if (badAddOn) { setError(t('errAddOnZero', { name: badAddOn.name || t('unnamedAddOn') })); return; }
    const dup = existingItems.some(x => x.id !== d.id && x.code.trim().toLowerCase() === d.code.trim().toLowerCase());
    if (dup) { setError(t('errCodeDuplicate', { code: d.code })); return; }
    setError('');
    onSave(d);
  };

  return (
    <div style={{ background: C.woodTint, border: `1px solid ${C.wood}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('productImage')}</div>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, width: 96, height: 96, border: `1.5px dashed ${C.wood}`, borderRadius: 8, cursor: uploadingImage ? 'default' : 'pointer', background: '#fff', overflow: 'hidden' }}>
            {uploadingImage ? (
              <Loader2 size={20} color={C.wood} style={{ animation: 'spin 1s linear infinite' }} />
            ) : d.image ? (
              <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <UploadCloud size={18} color={C.wood} />
                <span style={{ fontSize: 10.5, color: C.sub }}>{t('uploadImage')}</span>
              </>
            )}
            <input type="file" accept="image/*" disabled={uploadingImage} style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files[0])} />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, flex: 1, minWidth: 260 }}>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('codeLabel')}</div>
            <input style={inputStyle} placeholder={t('phCodeExample')} value={d.code} onChange={e => setD({ ...d, code: e.target.value })} />
          </div>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('productNameLabel')}</div>
            <input style={inputStyle} placeholder={t('phProductNameExample')} value={d.name} onChange={e => setD({ ...d, name: e.target.value })} />
          </div>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('categoryLabel')}</div>
            <select style={inputStyle} value={d.category || ''} onChange={e => setD({ ...d, category: e.target.value })}>
              <option value="">{t('chooseCategory')}</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('priceLabel')}</div>
            <input type="number" style={inputStyle} placeholder="0" value={d.price} onChange={e => setD({ ...d, price: Number(e.target.value) })} />
          </div>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('addOnStockCol')}</div>
            <input type="number" style={inputStyle} placeholder="0" value={d.stock} onChange={e => setD({ ...d, stock: Number(e.target.value) })} />
          </div>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 12, color: C.sub, marginBottom: 6, fontWeight: 600 }}>{t('colorLabel')}</div>
            <input style={inputStyle} placeholder={t('phColorExample')} value={d.color} onChange={e => setD({ ...d, color: e.target.value })} />
          </div>
        </div>
      </div>

      {error && <div style={{ color: C.brick, fontSize: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={13} /> {error}</div>}

      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: C.wood, textTransform: 'uppercase', marginBottom: 8 }}>{t('addOnSection')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
        {d.addOns.length > 0 && (
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: C.sub, fontWeight: 600, paddingLeft: 2 }}>
            <span style={{ flex: 2 }}>{t('addOnNameCol')}</span><span style={{ flex: 1 }}>{t('addOnStockCol')}</span><span style={{ flex: 1 }}>{t('addOnPriceCol')}</span><span style={{ width: 21 }} />
          </div>
        )}
        {d.addOns.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input style={{ ...inputStyle, flex: 2, background: '#fff' }} placeholder={t('phAddOnName')} value={a.name} onChange={e => updateAddOn(i, { name: e.target.value })} />
            <input type="number" style={{ ...inputStyle, flex: 1, background: '#fff' }} placeholder={t('phStockPlain')} value={a.stock ?? 0} onChange={e => updateAddOn(i, { stock: Number(e.target.value) })} />
            <input type="number" style={{ ...inputStyle, flex: 1, background: '#fff' }} placeholder={t('phPricePlain')} value={a.price} onChange={e => updateAddOn(i, { price: Number(e.target.value) })} />
            <button onClick={() => removeAddOn(i)} style={{ background: 'none', border: 'none', color: C.brick, cursor: 'pointer' }}><Trash2 size={15} /></button>
          </div>
        ))}
        {d.addOns.length === 0 && <div style={{ fontSize: 12, color: C.sub }}>{t('noAddOns')}</div>}
      </div>
      <Btn size="sm" variant="outline" icon={Plus} onClick={addAddOn}>{t('addNewAddOn')}</Btn>

      <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
        <Btn size="sm" icon={CheckCircle2} onClick={handleSave} disabled={uploadingImage}>{t('save')}</Btn>
        <Btn size="sm" variant="ghost" onClick={onCancel}>{t('cancel')}</Btn>
      </div>
    </div>
  );
}

/* ============================== Main App ============================== */
function AppInner({ initialOrders, initialClaims, initialItems, initialAccounts, initialUser }) {
  const { t } = useLang();
  const [user, setUser] = useState(initialUser || null);
  const [view, setView] = useState('home');
  const [orders, setOrders] = useState(initialOrders || []);
  const [claims, setClaims] = useState(initialClaims || []);
  const [items, setItems] = useState(initialItems || []);
  const [accounts, setAccounts] = useState(initialAccounts || []);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => { if (ready) upsertRows('orders', orders.map(orderAppToRow)); }, [orders]);
  useEffect(() => { if (ready) upsertRows('claims', claims.map(claimAppToRow)); }, [claims]);
  useEffect(() => { if (ready) replaceTable('items', items.map(itemAppToRow)); }, [items]);
  // 注意：accounts 不用整批同步（前端已经不存密码，整批写回去会把密码清空），
  // 新增/重设密码/删除都在 AccountsManager 里直接、个别地写入数据库

  const navMap = {
    salesman: [{ id: 'home', label: t('nav_dashboard'), icon: LayoutDashboard }, { id: 'history', label: t('nav_history'), icon: Clock }],
    leader: [{ id: 'home', label: t('nav_team_overview'), icon: LayoutDashboard }, { id: 'history', label: t('nav_history'), icon: Clock }],
    admin: [{ id: 'home', label: t('nav_pending_so'), icon: LayoutDashboard }],
    finance: [{ id: 'home', label: t('nav_finance_console'), icon: LayoutDashboard }],
  };

  return (
    <div style={{ fontFamily: fontBody }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        table { font-variant-numeric: tabular-nums; }
        ::selection { background: ${C.woodTint}; }
      `}</style>
      {!user ? (
        <LoginScreen accounts={accounts} onLogin={(u) => { setUser(u); setView('home'); }} />
      ) : (
        <Shell user={user} view={view} setView={setView} navItems={navMap[user.role]} onLogout={() => { supabase.auth.signOut(); setUser(null); }} accounts={accounts} setAccounts={setAccounts}>
          {user.role === 'salesman' && view === 'home' && <SalesmanDashboard user={user} orders={orders} items={items} claims={claims} setOrders={setOrders} setClaims={setClaims} accounts={accounts} />}
          {user.role === 'salesman' && view === 'history' && <SalesHistory orders={orders.filter(o => o.agent === user.name)} />}
          {user.role === 'leader' && view === 'home' && <LeaderDashboard user={user} orders={orders} claims={claims} accounts={accounts} />}
          {user.role === 'leader' && view === 'history' && <SalesHistory orders={orders.filter(o => o.team === user.team)} showAgent />}
          {user.role === 'admin' && <AdminDashboard orders={orders} setOrders={setOrders} items={items} setItems={setItems} />}
          {user.role === 'finance' && <FinanceDashboard orders={orders} claims={claims} setClaims={setClaims} items={items} setItems={setItems} accounts={accounts} setAccounts={setAccounts} />}
        </Shell>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 34, height: 34, border: `3px solid #3C3D35`, borderTopColor: C.woodLight, borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <div style={{ color: '#B8B2A0', fontFamily: fontMono, fontSize: 12, letterSpacing: '0.08em' }}>LOADING…</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function FurnitureOpsPrototype() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let [teamsRes, accountsRes, itemsRes, ordersRes, claimsRes] = await Promise.all([
          supabase.from('teams').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('items').select('*'),
          supabase.from('orders').select('*'),
          supabase.from('claims').select('*'),
        ]);

        // 第一次跑、数据库还是空的话，把种子资料写进去
        if (!teamsRes.error && teamsRes.data.length === 0) {
          await supabase.from('teams').insert(teamsMapToRows(INIT_TEAMS));
          teamsRes = await supabase.from('teams').select('*');
        }
        if (!accountsRes.error && accountsRes.data.length === 0) {
          // 账号现在是真正的 Supabase Auth 用户，要透过 Edge Function 一个一个建立
          for (const a of INIT_ACCOUNTS) {
            await supabase.functions.invoke('accounts-admin', { body: { action: 'create', role: a.role, name: a.name, team: a.team, password: a.password } });
          }
          // Finance 的登入账号（种子资料本身没有，额外建一个）
          await supabase.functions.invoke('accounts-admin', { body: { action: 'create', role: 'finance', name: 'Finance User', password: '123456' } });
          accountsRes = await supabase.from('profiles').select('*');
        }
        if (!itemsRes.error && itemsRes.data.length === 0) {
          await supabase.from('items').insert(INIT_ITEMS.map(itemAppToRow));
          itemsRes = await supabase.from('items').select('*');
        }
        if (!ordersRes.error && ordersRes.data.length === 0) {
          await supabase.from('orders').insert(INIT_ORDERS.map(orderAppToRow));
          ordersRes = await supabase.from('orders').select('*');
        }
        if (!claimsRes.error && claimsRes.data.length === 0) {
          await supabase.from('claims').insert(INIT_CLAIMS.map(claimAppToRow));
          claimsRes = await supabase.from('claims').select('*');
        }

        const firstError = [teamsRes, accountsRes, itemsRes, ordersRes, claimsRes].find(r => r.error);
        if (firstError) throw firstError.error;

        const teamsMap = teamsRowsToMap(teamsRes.data);
        const accountsList = accountsRes.data.map(accountRowToApp);

        // 如果浏览器还留着有效的登入 session，直接还原登入状态，不用重新登入
        let restoredUser = null;
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const acc = accountsList.find(a => a.id === sessionData.session.user.id);
          if (acc) {
            restoredUser = {
              role: acc.role, name: acc.role === 'leader' ? teamsMap[acc.team]?.name : acc.name,
              team: acc.team, accountId: acc.id, email: acc.email,
              leaderName: acc.role === 'leader' ? teamsMap[acc.team]?.leader : undefined,
            };
          }
        }

        if (!cancelled) {
          setData({
            teams: teamsMap,
            accounts: accountsList,
            items: itemsRes.data.map(itemRowToApp),
            orders: ordersRes.data.map(orderRowToApp),
            claims: claimsRes.data.map(claimRowToApp),
            initialUser: restoredUser,
          });
          setLoading(false);
        }
      } catch (e) {
        console.error('load from supabase failed:', e);
        if (!cancelled) { setLoadError(e.message || String(e)); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingScreen />;

  if (loadError) {
    return (
      <div style={{ minHeight: '100vh', background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, color: '#F5F1E8', fontFamily: fontBody, textAlign: 'center' }}>
          <div style={{ fontFamily: fontDisplay, fontSize: 20, marginBottom: 10 }}>无法连线到数据库</div>
          <div style={{ color: '#B8B2A0', fontSize: 13, marginBottom: 6 }}>{loadError}</div>
          <div style={{ color: '#8A8474', fontSize: 12 }}>请确认 Supabase 专案设定与网路连线，然后重新整理页面。</div>
        </div>
      </div>
    );
  }

  return (
    <LangProvider>
      <TeamsProvider initialTeams={data.teams}>
        <AppInner initialAccounts={data.accounts} initialItems={data.items} initialOrders={data.orders} initialClaims={data.claims} initialUser={data.initialUser} />
      </TeamsProvider>
    </LangProvider>
  );
}
