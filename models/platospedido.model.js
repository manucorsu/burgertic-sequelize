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
    idPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idPlato: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "platosPedido",
    timestamps: false,
  }
);
