from pyteal import *

class Product:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        description = Bytes("DESCRIPTION")
        price = Bytes("PRICE")
        sold = Bytes("SOLD")
        totalRating = Bytes("TOTAL_RATING")
        numRatings = Bytes("NUM_RATINGS")

    class AppMethods:
        buy = Bytes("buy")
        rate = Bytes("rate")

    def application_creation(self):
        return Seq([
            Assert(Txn.application_args.length() == Int(4)),
            Assert(Txn.note() == Bytes("tutorial-marketplace:uv1")),
            Assert(Btoi(Txn.application_args[3]) > Int(0)),
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.description, Txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.sold, Int(0)),
            App.globalPut(self.Variables.totalRating, Int(0)),
            App.globalPut(self.Variables.numRatings, Int(0)),
            Approve()
        ])
    
    def rate(self):
        rating = Btoi(Txn.application_args[1])
        valid_rating = And(rating > Int(0), rating <= Int(5))
        
        update_rating = Seq([
            App.globalPut(self.Variables.totalRating, App.globalGet(self.Variables.totalRating) + rating),
            App.globalPut(self.Variables.numRatings, App.globalGet(self.Variables.numRatings) + Int(1)),
            Approve()
        ])

        return If(valid_rating).Then(update_rating).Else(Reject())


    def validate_payment(self, count):
        return And(
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == Global.creator_address(),
            Gtxn[1].amount() == App.globalGet(self.Variables.price) * Btoi(count),
            Gtxn[1].sender() == Gtxn[0].sender(),
        )

    def buy(self):
        count = Txn.application_args[1]
        valid_number_of_transactions = Global.group_size() == Int(2)
        valid_payment_to_seller = self.validate_payment(count)

        can_buy = And(valid_number_of_transactions, valid_payment_to_seller)

        update_state = Seq([
            App.globalPut(self.Variables.sold, App.globalGet(self.Variables.sold) + Btoi(count)),
            Approve()
        ])

        return If(can_buy).Then(update_state).Else(Reject())

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication, self.application_deletion()],
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()],
            [Txn.application_args[0] == self.AppMethods.rate, self.rate()]
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
