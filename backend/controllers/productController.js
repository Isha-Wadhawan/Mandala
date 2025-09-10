import productModel from "../models/productModel.js"
import {v2 as cloudinary} from "cloudinary"

// add Product
const addProduct = async (req,res) =>{
  try {

    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );
    const product = await productModel.create({
      name,
      description,
      price : Number(price) || 0,
      category,
      subCategory,
      sizes : JSON.parse(sizes),
      bestSeller : bestSeller === "true" ? true : false,
      images: imagesUrl,
      date : Date.now()
    });
    return res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}


// list product

const listProducts = async (req,res) => {

    try {

        const products = await productModel.find({});
        res.json({success: true, products});

    }
    catch(err){
        console.log(err);
        res.json({success: false, message : err.message});

    }
}

//removing product

const removeProduct = async (req,res) => {

    try {

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Product Removed"})
        

    }
    catch(err)
    {
        console.log(err);
        res.json({success:false, message : err.message})
    }
}

// single product info

const singleProduct = async (req,res) =>{

    try{

        const {productId} = req.body;
        const product = await productModel.findById(productId);

        res.json({success:true, product});

    }

    catch(err){
        console.log(err);
        res.json({success:false, message:  err.message})
        

    }

}

export {addProduct, listProducts, removeProduct, singleProduct}