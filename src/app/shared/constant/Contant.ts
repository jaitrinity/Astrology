export class Constant{

    // public static phpBaseURL = "https://trinityapplab.in/Astrology";
    public static phpBaseURL = "/Astrology";
    public static baseURL = "https://json.freeastrologyapi.com";
    
    public static BAD_REQUEST_STATUS_CODE = "400";
    public static UNAUTORIZED_STATUS_CODE = "401";
    public static ALREADY_EXIST_CODE = "403";
    public static SUCCESSFUL_STATUS_CODE = "100000";
    public static GENERIC_DATABASE_ERROR = "-102003";
    public static NO_RECORDS_FOUND_CODE = "102001";
    public static NO_RECORD_FOUND = "No Record Found";
    public static ASTRO_PRIVATE_KEY = "ASTROPRIVATEKEY";
    public static ACCESS_TOKEN_KEY = "access_token";
    public static REFRESH_TOKEN_KEY = "refresh_token";
    public static SERVER_ERROR = "Server Error";
    public static TOSTER_FADEOUT_TIME = 1000;
    public static ALERT_FADEOUT_TIME = 2000;
    
    public static returnServerErrorMessage(serviceName:string):string{
        return "Server error while invoking "+serviceName+ " service";
    }
    
}