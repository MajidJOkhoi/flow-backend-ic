class ApiError extends Error{
              constructor(statusCode,message="Something went wrong",errors=[]){
                super(message)
                this.message=message
                this.errors=errors
                this.statusCode=statusCode
              }
}

export {ApiError}