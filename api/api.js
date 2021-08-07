const baseUrl = '/pile';
// const baseUrl = 'http://124.71.199.7:8866';

const api = {
	'isAuth':`${baseUrl}/wx/isAuth`,//微信登陆-是否已授权
	'isAuthNew':`${baseUrl}/wxminiProgram/authorization/isAuth`,//微信登陆-是否已授权
	'login':`${baseUrl}/wx/login`,//微信登陆-获取openId和sessionKey
	'electricityPrice':`${baseUrl}/electricityPrice/list`,//电价 
	'malfunctions':`${baseUrl}/chargingpile/malfunctions`,//故障信息 
	'chargeRecords':`${baseUrl}/chargingpile/chargeRecords`,//充电信息 
	'chargeLatest':`${baseUrl}/chargingpile/chargeLatest`,//最后一次充电时间 
	'appoint':`${baseUrl}/chargingpile/appoint`,//预约充电
	'appointList':`${baseUrl}/chargingpile/appointList`,//预约列表
	'appointListByCode':`${baseUrl}/chargingpile/appointListByCode`,//预约列表
	'appointAdd':`${baseUrl}/chargingpile/appointAdd`,//预约充电
	'appointUpdate':`${baseUrl}/chargingpile/appointUpdate`,//预约充电
	'appointDelete':`${baseUrl}/chargingpile/appointDelete`,//预约充电删除
	'isExistAddress':`${baseUrl}/chargingpile/isExistAddress`,//查询绑定桩地址
	'mainPile':`${baseUrl}/chargingpile/mainPile`,//绑定
	'update':`${baseUrl}/chargingpile/update`,//修改
	'binding':`${baseUrl}/chargingpile/binding`,//绑定充电桩列表
	'bindingList':`${baseUrl}/chargingpile/List`,//获取绑定充电桩列表
	'getMainPile':`${baseUrl}/chargingpile/getMainPile`,//获取绑定的主充电桩
	'control':`${baseUrl}/chargingpile/control`,//控制充电桩、启动充电桩、停止充电桩
	'feedbackAdd':`${baseUrl}/feedback/add`,//反馈意见-添加
	'feedbackFindByOpenId':`${baseUrl}/feedback/findByOpenId`,//反馈意见id列表
	'feedbackList':`${baseUrl}/feedback/list`,//反馈意见列表
	'feedbackDatailAdd':`${baseUrl}/feedbackDatail/add`,//反馈意见详情-添加
	'feedbackDatailList':`${baseUrl}/feedbackDatail/list`,//反馈意见详情列表
	'feedbackReply':`${baseUrl}/feedback/reply`,//回复
	'feedbackGet':`${baseUrl}/feedback`,//根据ID获取详情
	'faqList':`${baseUrl}/faq/list`,//常见问题列表查询
	'memberList':`${baseUrl}/member/list`,//获取成员列表
	'member':`${baseUrl}/member`,//删除成员
	'instructionsGet':`${baseUrl}/instructions/get`,//根据型号获取说明书
	
}

export default api;