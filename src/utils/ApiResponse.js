class ApiResponse {
    constructor(statusCode,data,message = "success"){
        this.data =data,
        this.message =message,
        this.success =this.statusCode
    }
}
export { ApiResponse }