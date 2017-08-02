require('mysql2/node_modules/iconv-lite').encodingExists('utf-8');
//see https://github.com/sidorares/node-mysql2/issues/489
const config = require('dotenv').config()
const model = require('../Model')
const GLService = {
    getGL: () => {
        return model.GL.findAll({})
    },
    createForTransactionTransferTo: (amount, sourceId, transactionId, bankId) => {
        return {
            dr_action: 'Saving',
            dr_amount: amount,
            dr_type: 'L',
            cr_action: 'Cash',
            cr_amount: amount,
            cr_type: 'A',
            account_ID: sourceId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    createForTransactionRecieveFrom: (amount, destinationId, transactionId, bankId) => {
        return {
            dr_action: 'Cash',
            dr_amount: amount,
            dr_type: 'A',
            cr_action: 'Saving',
            cr_amount: amount,
            cr_type: 'L',
            account_ID: destinationId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    createFeeForTransactionTransferTo: (fee, sourceId, transactionId, bankId) => {
        return {
            dr_action: 'Saving',
            dr_amount: fee,
            dr_type: 'L',
            cr_action: 'Cash',
            cr_amount: fee,
            cr_type: 'A',
            account_ID: sourceId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    createFeeForTransactionRecieveFrom: (fee, destinationId, transactionId, bankId) => {
        return {
            dr_action: 'Cash',
            dr_amount: fee,
            dr_type: 'A',
            cr_action: 'Fee',
            cr_amount: fee,
            cr_type: 'R',
            account_ID: bankId,
            transaction_ID: transactionId,
            bank_ID: bankId
        }
    },
    checkBalanceforGL: (GLObjectTransactionTransferTo, GLObjectTransactionRecieveFrom) => {
        let debitAmount = GLObjectTransactionTransferTo.dr_amount + GLObjectTransactionRecieveFrom.dr_amount;
        let creditAmount = GLObjectTransactionTransferTo.cr_amount + GLObjectTransactionRecieveFrom.cr_amount;
        if (debitAmount === creditAmount) {
            return true;
        }
        return false;
    },
    insertGL4: (GLObject1, GLObject2, GLObject3, GLObject4) => {
        //transfer : case fee != 0
        return model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.GL.create(GLObject1, { transaction: t1 }),
                model.GL.create(GLObject2, { transaction: t1 }),
                model.GL.create(GLObject3, { transaction: t1 }),
                model.GL.create(GLObject4, { transaction: t1 })
            ])
        })

    },
    insertGL5: (ArrayOfGLObject) => {
        return model.sequelize.transaction((t1) => {
            const operation = ArrayOfGLObject.map((obj) => {
                return model.GL.create(obj, { transaction: t1 })
            })
            return model.sequelize.Promise.all(operation)
        })
    },
    insertGL2: (GLObject1, GLObject2) => {
        //transfer : case fee == 0
        return model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.GL.create(GLObject1, { transaction: t1 }),
                model.GL.create(GLObject2, { transaction: t1 })
            ])
        })
    },
    insertGL1: (GLObject2) => {
        //top up        
        return model.sequelize.transaction((t1) => {
            return model.sequelize.Promise.all([
                model.GL.create(GLObject2, { transaction: t1 })
            ])
        })

    }

}
module.exports = GLService
