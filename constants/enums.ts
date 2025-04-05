export enum realEstateStatus {
    EXPIRED = 0,        // Hết hiệu lực (đã huỷ, hết thời hạn ký gửi)
    ACTIVE = 1,         // Hoạt động (còn hạn, chưa bán)
    DEPOSITED = 2,      // Đã được đặt cọc
    SOLD = 3            // Đã sang nhượng (đã bán)
}

export enum depositContractStatus {
    CANCELED = 0,       // Hết hiệu lực (đã huỷ, hết thời hạn đặt cọc)
    DEPOSITED = 2,      // Đã đặt cọc, đang chờ sang nhượng
    COMPLETED = 3       // Đã hoàn tất sang nhượng
}