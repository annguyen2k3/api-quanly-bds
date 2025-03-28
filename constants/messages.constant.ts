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
  