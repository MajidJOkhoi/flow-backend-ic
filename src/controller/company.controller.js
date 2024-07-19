


const companyRegistration=async(req,res)=>{

const {admin,company}=req.body




    res.status(200).json({
        sucess:true,
        message:"Sucessfully company registered",
        admin,
        company
    })
}


export {companyRegistration}