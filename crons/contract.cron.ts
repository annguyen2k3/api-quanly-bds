import cron from 'node-cron';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

export const runContractCron = () => {
  cron.schedule(
    //Chạy mỗi 0h hàng ngày
    '0 0 * * *', 
    async () => {
      try {
        // cập nhật hợp đồng ký gửi hết hạn
        const [consignmentCountResult]: any = await sequelize.query(
          `
          SELECT COUNT(*) AS count
          FROM hop_dong_ky_gui hdkg
          JOIN bat_dong_san bds ON hdkg.bdsid = bds.bdsid
          WHERE hdkg.ngayketthuc < CURDATE()
            AND hdkg.trangthai != 0
            AND bds.tinhtrang = 1
          `,
          { type: QueryTypes.SELECT }
        );

        const consignmentCount = consignmentCountResult.count ?? 0;

        await sequelize.query(
          `
          UPDATE bat_dong_san bds
          JOIN hop_dong_ky_gui hdkg ON bds.bdsid = hdkg.bdsid
          SET bds.tinhtrang = 0,
              hdkg.trangthai = 0
          WHERE hdkg.ngayketthuc < CURDATE()
            AND hdkg.trangthai = 1
            AND bds.tinhtrang = 1
          `,
          { type: QueryTypes.UPDATE }
        );

        console.log(`[Cron] Đã cập nhật ${consignmentCount} hợp đồng ký gửi hết hạn.`);
        // kết thúc cập nhật hợp đồng ký gửi hết hạn
        
        // cập nhật hợp đồng đặt cọc hết hạn
        const [depositCountResult]: any = await sequelize.query(
          `
          SELECT COUNT(*) AS count
          FROM hop_dong_dat_coc hddc
          JOIN hop_dong_ky_gui hdkg ON hddc.bdsid = hdkg.bdsid
          JOIN bat_dong_san bds ON bds.bdsid = hddc.bdsid
          WHERE hddc.ngayhethan < CURDATE()
            AND hddc.tinhtrang = 2
            AND bds.tinhtrang = 2
            AND hdkg.trangthai = 0
          `,
          { type: QueryTypes.SELECT }
        );

        const depositCount = depositCountResult.count ?? 0;

        await sequelize.query(
          `
          UPDATE bat_dong_san bds
          JOIN hop_dong_ky_gui hdkg ON bds.bdsid = hdkg.bdsid
          JOIN hop_dong_dat_coc hddc ON bds.bdsid = hddc.bdsid
          SET bds.tinhtrang = 1,
              hdkg.trangthai = 1,
              hddc.tinhtrang = 0
          WHERE hddc.ngayhethan < CURDATE()
            AND hddc.tinhtrang = 2
            AND bds.tinhtrang = 2
            AND hdkg.trangthai = 0
          `,
          { type: QueryTypes.UPDATE }
        );

        console.log(`[Cron] Đã cập nhật ${depositCount} hợp đồng đặt cọc hết hạn.`);
        // kết thúc cập nhật hợp đồng đặt cọc hết hạn
      } catch (err) {
        console.error('[Cron] Lỗi khi cập nhật hợp đồng hết hạn:', err);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh'
    }
  );
};
