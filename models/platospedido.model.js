import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class PlatosPedido extends Model {}

PlatosPedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "platosPedido",
    timestamps: false,
  }
);
