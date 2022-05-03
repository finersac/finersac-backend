import sql from "../models/db";
import util from "util";

const query = util.promisify(sql.query).bind(sql);

const getUsers = async (req: any, res: any) => {
  const idUser = req.user.id;
  const response = await query(
    "select id, email as correo,name as nombre_usuario,phone as telefono_usuario from users sr where sr.id=$1 ",
    [idUser]
  );
  res.status(200).json(response.values[0]);
};

export { getUsers, };