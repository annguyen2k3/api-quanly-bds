import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config()

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        dialectOptions: {
            typeCast: function (field, next) {
                if(field.type === 'BIT' && field.length === 1) {
                    const bytes = field.buffer();
                    return bytes[0];
                }
                return next();
            }
        }
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log("Connect Success!")
    })
    .catch((error) => {
        console.error("Connect Error: " + error);
    })

export default sequelize