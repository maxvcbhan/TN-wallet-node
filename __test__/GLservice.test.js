var GLService = require('../Controller/GLService')

describe('testcreateForTransactionTransferTo', function(){
    it("should succesfully createForTransactionTransferTo object", ()=>{
        inputAmount = 500;
        inputSourceId = 1111111111;
        inputTransactionId = '001';
        inputBankId = '001'
        var expectedResult = {
          dr_action: 'Saving',
          dr_amount: 500,
          dr_type: 'L',
          cr_action: 'Cash',
          cr_amount: 500,
          cr_type: 'A',          
          account_ID: 1111111111,
          transaction_ID: '001',
          bank_ID: '001'
        };
        var result = GLService.createForTransactionTransferTo(inputAmount, inputSourceId, inputTransactionId,inputBankId)
        expect(result).toEqual(expectedResult)
    })
})

describe('testcreateForTransactionRecieveFrom', function(){
    it("should succesfully createForTransactionRecieveFrom object", ()=>{
        inputAmount = 500;
        inputDestinationId = 1234567890;
        inputTransactionId = '001';
        inputBankId = '001'
        var expectedResult = {
          dr_action: 'Cash',
          dr_amount: 500,
          dr_type: 'A',
          cr_action: 'Saving',
          cr_amount: 500,
          cr_type: 'L',
          account_ID: 1234567890,
          transaction_ID: '001',
          bank_ID: '001'
        };
        var result = GLService.createForTransactionRecieveFrom(inputAmount, inputDestinationId, inputTransactionId,inputBankId)
        expect(result).toEqual(expectedResult)
    })
})

describe('testcheckBalanceforGL', function(){
    it("should succesfully checkBalanceforGL", ()=>{
        var inputGLobjectTransactionTransferTo = {
          dr_action: 'Saving',
          dr_amount: 500,
          dr_type: 'L'
          ,
          cr_action: 'Cash',
            cr_amount: 500,
            cr_type: 'A'
          ,account_ID: 1111111111,
          transaction_ID: '001',
          bank_ID:'001'
        };
        var GLobjectTransactionRecieveFrom = {
          dr_action: 'Cash',
            dr_amount: 500,
            dr_type: 'A',
          
            cr_action: 'Saving',
            cr_amount: 500,
            cr_type: 'L'
          ,
          account_ID: 1234567890,
          transaction_ID: '001',
          bank_ID: '001'
        };
        var result = GLService.checkBalanceforGL(inputGLobjectTransactionTransferTo, GLobjectTransactionRecieveFrom)
        expect(result).toBe(true)
    })
})
