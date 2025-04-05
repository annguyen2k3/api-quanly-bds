export enum realEstateStatus {
    EXPIRED = 0,        // Hết hiệu lực (đã huỷ, hết thời hạn ký gửi)
    ACTIVE = 1,         // Hoạt động (còn hạn, chưa bán)
    DEPOSITED = 2,      // Đã được đặt cọc
    SOLD = 3            // Đã sang nhượng (đã bán)
}