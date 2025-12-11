const axios = require('axios');

// OTP Service Configuration
// You can switch between different providers by changing the implementation

class OTPService {
    constructor() {
        // In-memory store for development/fallback
        this.otpStore = new Map();
        
        // SMS Provider Configuration
        this.provider = process.env.SMS_PROVIDER || 'SMSINDIAHUB'; // SMSINDIAHUB, MSG91, TWILIO, FAST2SMS
        
        // SMS India Hub Configuration
        this.smsIndiaHubConfig = {
            user: process.env.SMSINDIAHUB_USER || '',
            password: process.env.SMSINDIAHUB_PASSWORD || '',
            senderId: process.env.SMSINDIAHUB_SENDER_ID || 'SMSHUB',
            gwid: '2' // 2 for Transactional SMS (required for OTP)
        };
        
        // MSG91 Configuration
        this.msg91Config = {
            authKey: process.env.MSG91_AUTH_KEY || '',
            templateId: process.env.MSG91_TEMPLATE_ID || '',
            senderId: process.env.MSG91_SENDER_ID || 'ENPEES'
        };
        
        // Twilio Configuration
        this.twilioConfig = {
            accountSid: process.env.TWILIO_ACCOUNT_SID || '',
            authToken: process.env.TWILIO_AUTH_TOKEN || '',
            phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
        };
        
        // Fast2SMS Configuration
        this.fast2smsConfig = {
            apiKey: process.env.FAST2SMS_API_KEY || ''
        };
        
        // OTP Configuration
        this.otpLength = 6;
        this.otpExpiry = 5 * 60 * 1000; // 5 minutes
    }
    
    // Generate random OTP
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // Store OTP with expiry
    storeOTP(phone, otp) {
        this.otpStore.set(phone, {
            otp,
            expires: Date.now() + this.otpExpiry
        });
    }
    
    // Verify OTP
    verifyOTP(phone, otp) {
        const record = this.otpStore.get(phone);
        
        if (!record) {
            return { valid: false, error: 'No OTP found for this number' };
        }
        
        if (Date.now() > record.expires) {
            this.otpStore.delete(phone);
            return { valid: false, error: 'OTP has expired' };
        }
        
        if (record.otp !== String(otp)) {
            return { valid: false, error: 'Invalid OTP' };
        }
        
        // OTP is valid, remove it
        this.otpStore.delete(phone);
        return { valid: true, message: 'OTP verified successfully' };
    }
    
    // Send OTP via MSG91
    async sendViaMSG91(phone, otp) {
        try {
            const url = `https://api.msg91.com/api/v5/otp`;
            
            // Format: Remove +91 if present and ensure 10 digits
            const formattedPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
            
            const payload = {
                template_id: this.msg91Config.templateId,
                mobile: `91${formattedPhone}`,
                authkey: this.msg91Config.authKey,
                otp: otp,
                otp_expiry: 5 // minutes
            };
            
            // If template_id is not set, use direct SMS API
            if (!this.msg91Config.templateId) {
                const response = await axios.post(
                    'https://api.msg91.com/api/v5/flow/',
                    {
                        flow_id: this.msg91Config.templateId,
                        sender: this.msg91Config.senderId,
                        mobiles: `91${formattedPhone}`,
                        VAR1: otp,
                        VAR2: '5' // expiry minutes
                    },
                    {
                        headers: {
                            'authkey': this.msg91Config.authKey,
                            'content-type': 'application/json'
                        }
                    }
                );
                
                return { success: true, response: response.data };
            }
            
            const response = await axios.post(url, payload, {
                headers: {
                    'authkey': this.msg91Config.authKey,
                    'content-type': 'application/json'
                }
            });
            
            return { success: true, response: response.data };
        } catch (error) {
            console.error('MSG91 Error:', error.response?.data || error.message);
            throw new Error('Failed to send OTP via MSG91');
        }
    }
    
    // Send OTP via Twilio
    async sendViaTwilio(phone, otp) {
        try {
            const accountSid = this.twilioConfig.accountSid;
            const authToken = this.twilioConfig.authToken;
            const client = require('twilio')(accountSid, authToken);
            
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
            
            const message = await client.messages.create({
                body: `Your Enpees Candles OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`,
                from: this.twilioConfig.phoneNumber,
                to: formattedPhone
            });
            
            return { success: true, response: message };
        } catch (error) {
            console.error('Twilio Error:', error);
            throw new Error('Failed to send OTP via Twilio');
        }
    }
    
    // Send OTP via SMS India Hub
    async sendViaSMSIndiaHub(phone, otp) {
        try {
            const formattedPhone = phone.replace(/^\+/, '').replace(/\D/g, '');
            // Ensure it starts with 91 for India
            const mobileNumber = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;
            
            const message = `Your OTP for Enpees Candles is: ${otp}. Valid for 5 minutes. Do not share with anyone.`;
            const encodedMessage = encodeURIComponent(message);
            
            const url = `http://cloud.smsindiahub.in/vendorsms/pushsms.aspx?user=${this.smsIndiaHubConfig.user}&password=${this.smsIndiaHubConfig.password}&msisdn=${mobileNumber}&sid=${this.smsIndiaHubConfig.senderId}&msg=${encodedMessage}&fl=0&gwid=${this.smsIndiaHubConfig.gwid}`;
            
            const response = await axios.get(url);
            
            // Check response for success
            const data = response.data;
            if (typeof data === 'string' && data.includes('Success')) {
                return { success: true, response: data };
            } else if (typeof data === 'object' && data.ErrorCode === '000') {
                return { success: true, response: data };
            }
            
            throw new Error('SMS India Hub returned error response');
        } catch (error) {
            console.error('SMS India Hub Error:', error.response?.data || error.message);
            throw new Error('Failed to send OTP via SMS India Hub');
        }
    }
    
    // Send OTP via Fast2SMS
    async sendViaFast2SMS(phone, otp) {
        try {
            const formattedPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
            
            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                params: {
                    authorization: this.fast2smsConfig.apiKey,
                    variables_values: otp,
                    route: 'otp',
                    numbers: formattedPhone
                }
            });
            
            return { success: true, response: response.data };
        } catch (error) {
            console.error('Fast2SMS Error:', error.response?.data || error.message);
            throw new Error('Failed to send OTP via Fast2SMS');
        }
    }
    
    // Main send OTP method
    async sendOTP(phone) {
        const otp = this.generateOTP();
        
        // Store OTP first
        this.storeOTP(phone, otp);
        
        // Check if any SMS provider is configured
        const hasProvider = 
            (this.provider === 'SMSINDIAHUB' && this.smsIndiaHubConfig.user && this.smsIndiaHubConfig.password) ||
            (this.provider === 'MSG91' && this.msg91Config.authKey) ||
            (this.provider === 'TWILIO' && this.twilioConfig.accountSid) ||
            (this.provider === 'FAST2SMS' && this.fast2smsConfig.apiKey);
        
        if (!hasProvider) {
            // Development mode: Just log OTP
            console.log(`\n========================================`);
            console.log(`📱 DEVELOPMENT MODE - OTP for ${phone}: ${otp}`);
            console.log(`⏰ Valid for 5 minutes`);
            console.log(`========================================\n`);
            
            return {
                success: true,
                message: 'OTP generated (Development Mode)',
                devMode: true,
                otp: process.env.NODE_ENV === 'development' ? otp : undefined
            };
        }
        
        // Send via configured provider
        try {
            let result;
            
            switch (this.provider) {
                case 'SMSINDIAHUB':
                    result = await this.sendViaSMSIndiaHub(phone, otp);
                    break;
                case 'MSG91':
                    result = await this.sendViaMSG91(phone, otp);
                    break;
                case 'TWILIO':
                    result = await this.sendViaTwilio(phone, otp);
                    break;
                case 'FAST2SMS':
                    result = await this.sendViaFast2SMS(phone, otp);
                    break;
                default:
                    throw new Error('Invalid SMS provider');
            }
            
            console.log(`✅ OTP sent to ${phone} via ${this.provider}`);
            return {
                success: true,
                message: `OTP sent successfully via ${this.provider}`,
                devMode: false
            };
        } catch (error) {
            console.error(`❌ Failed to send OTP via ${this.provider}:`, error.message);
            
            // Fallback to development mode
            console.log(`\n========================================`);
            console.log(`📱 FALLBACK MODE - OTP for ${phone}: ${otp}`);
            console.log(`⏰ Valid for 5 minutes`);
            console.log(`⚠️  SMS Provider failed, using fallback`);
            console.log(`========================================\n`);
            
            return {
                success: true,
                message: 'OTP sent (Fallback Mode)',
                devMode: true,
                otp: process.env.NODE_ENV === 'development' ? otp : undefined,
                warning: 'SMS service unavailable, using fallback mode'
            };
        }
    }
}

// Export singleton instance
module.exports = new OTPService();
