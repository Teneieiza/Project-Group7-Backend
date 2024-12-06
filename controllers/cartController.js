import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
    try {
      const { userId, gameId, title, categories, price } = req.body;
  
      // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
      if (!userId || !gameId || !title || !categories || !price) {
        return res.json({ success: false, message: "Missing required fields" });
      }
  
      const userData = await userModel.findById(userId);
      if (!userData) {
        return res.json({ success: false, message: "User not found" });
      }
  
      let cartData = userData.cartData || {}; // ถ้า cartData ไม่มี, สร้างเป็น Object ว่าง
  
      // เพิ่มข้อมูลใน cartData
      cartData[gameId] = {
        gameId: gameId,
        title: title,
        categories: categories,
        price: price
      };
  
      // บันทึกข้อมูลที่อัพเดทในฐานข้อมูล
      await userModel.findByIdAndUpdate(userId, { cartData });

      // แสดงผลลัพธ์ใน console (optional)
      console.log(`User ${userId} added game: ${title} to cart`);

    res.status(200).json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
  }
};


// delete products from user cart
const deleteGameInCart = async (req, res) => {
    try {
      const { userId, gameId, title } = req.body; // รับข้อมูล userId และ gameId จาก body
  
      // ตรวจสอบว่า userId และ gameId มีอยู่ใน body หรือไม่
      if (!userId || !gameId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // ค้นหาข้อมูลของผู้ใช้จากฐานข้อมูล
      const userData = await userModel.findById(userId);
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // ตรวจสอบว่าผู้ใช้มีตะกร้าหรือไม่
      let cartData = userData.cartData;
      if (!cartData || !cartData[gameId]) {
        return res.status(404).json({ success: false, message: "Game not found in cart" });
      }
  
      // ลบข้อมูลเกมจาก cartData
      delete cartData[gameId];
  
      // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      await userModel.findByIdAndUpdate(userId, { cartData });
  
      // แสดงผลลัพธ์ใน console (optional)
      console.log(`User ${userId} removed game: ${title} from cart`);
  
      res.status(200).json({ success: true, message: "Game removed from cart" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
  };

// get user cart data อ่านข้อมูลที่อยู่ใน cart
  const getUserCart = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // ตรวจสอบว่า userId ถูกส่งมาไหม
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }
  
      // ค้นหาข้อมูลผู้ใช้จากฐานข้อมูล
      const userData = await userModel.findById(userId);
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // ตรวจสอบว่าผู้ใช้มี cartData หรือไม่
      const cartData = userData.cartData || {};  // ถ้าไม่มี cartData ก็จะได้เป็น object ว่าง
      if (Object.keys(cartData).length === 0) {
        return res.status(200).json({ success: true, message: "Cart is empty", cartData: cartData });
      }
  
      // ส่งข้อมูลตะกร้ากลับไป
      res.json({ success: true, cartData: cartData });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
  };

export { addToCart, deleteGameInCart, getUserCart };
