import { STATUS_CODES } from "http";

export const CommonMess = {
    SERVER_ERROR: 'Lỗi server',
    UNAUTHORIZED: 'Không có quyền truy cập',
    FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
    INVALID_DATA: 'Thông tin không hợp lệ',
    GET_SUCCESS: 'Lấy thông tin thành công',
    CREATE_SUCCESS: 'Tạo thành công',
    UPDATE_SUCCESS: 'Cập nhật thành công'
  } as const;

export const InfoPersonalMess = {
  NAME_REQUIRED: 'Tên không được để trống',
  NAME_INVALID: 'Tên không được chứa ký tự đặc biệt hoặc số',
  PHONENUMBER_INVALID: 'Số điện thoại không hợp lệ',
  ADDRESS_REQUIRED: 'Địa chỉ không được để trống',
  BIRTHDAY_INVALID: 'Ngày sinh không hợp lệ',
  SEX_REQUIRED: 'Giới tính phải là Nam(1) hoặc Nữ(0)',
  EMAIL_INVALID: 'Email không hợp lệ',
  EMAIL_EXITS: 'Email đã tồn tại'
} as const;
  
export const StaffMess = {
  ...InfoPersonalMess,
  ID_NOT_EXITS: 'Mã nhân viên không tồn tại',
  ROLE_INVALID: 'Quyền không hợp lệ.',
  STATUS_INVALID: 'Trạng thái không hợp lệ'
} as const;

export const CustomerMess = {
  ...InfoPersonalMess,
  ID_REQUIRED: 'Yêu cầu mã khách hàng',
  ID_NOT_EXITS: 'Mã khách hàng không tồn tại',
  CMND_INVALID: 'CMND không hợp lệ',
  CMND_EXITS: 'CMND đã tồn tại',
  STATUS_INVALID: 'Trạng thái không hợp lệ',
  TYPE_INVALID: 'Loại khách hàng không hợp lệ',
  BUYER_NOT_SELLER: 'Người mua không thể là người bán bất động sản này'
} as const;

export const AuthMess = {
  AUTH_REQUIRED: 'Vui lòng đăng nhập',
  TOKEN_INVALID: 'Token không hợp lệ',
  ROLE_NOT_ACCESS: 'Không có quyền truy cập',
  ACCOUNT_REQUIRED: 'Tài khoản không được để trống',
  ACCOUNT_EXITS: 'Tài khoản đã tồn tại',
  ACCOUNT_NOT_EXITS: 'Tài khoản không tồn tại',
  ACCOUNT_INACTIVE: 'Tài khoản đã bị khoá',
  PASSWORD_INVALID: 'Mật khẩu ít nhất 6 ký tự',
  PASSWORD_INCORRECT: 'Sai mật khẩu',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_FAILURE: 'Tài khoản hoặc mật khẩu không đúng',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
} as const;
  
export const RealEstateMess = {
  IDTYPE_INVALID: 'Loại BDS không hợp lệ',
  ID_NOT_EXIST: 'Mã BDS không tồn tại',
  ADDRESS_REQUIRED: 'Địa chỉ không được để trống',
  STATUS_INVALID: 'Tình trạng không hợp lệ',
  ASSET_CODE: 'MSQSDD không hợp lệ',
  IMG_REQUIRED: 'Yêu cầu tải lên ít nhất 1 ảnh',
  ASSET_CODE_EXIST: 'MSQSQD đã tồn tại',
  PRICE_INVALID: 'Giá không hợp lệ',
  SIZE_INVALID: 'Kích thước không hợp lệ',
  ROSES_INVALID: 'Huê hồng không hợp lệ',
  EXPIRED: 'Bất động sản hết hiệu lực ký gửi',
  ACTIVE: 'Bất động sản đang được ký gửi',
  DEPOSITED: 'Bất động sản đã được đặt đọc',
  SOLD: 'Bất động sản đã sang nhượng',
  CUSTOMER_NOT_ROLE: 'Bất động sản không thuộc quyền sở hữu của khách hàng này'
} as const;

export const ContractMess = {
  KGID_NOT_EXIST: 'Hợp đồng kí gửi không tồn tại',
  DCID_NOT_EXIST: 'Hợp đồng đặt cọc không tồn tại',
  STATUS_INVALID: 'Trạng thái hợp đồng không hợp lệ',
  CONDITION_INVALID: 'Tình trạng hợp đồng không hợp lệ',
  VALUE_INVALID: 'Giá trị không hợp lệ',
  COST_INVALID: 'Chi phí dịch vụ không hợp lệ',
  DATE_INVALID: 'Ngày không hợp lệ',
  CANCEL_SUCCESSED: 'Huỷ hợp đồng thành công'
} as const;