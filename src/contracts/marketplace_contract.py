from pyteal import *


class Product:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        description = Bytes("DESCRIPTION")
        price = Bytes("PRICE")
        sold = Bytes("SOLD")

    class AppMethods:
        buy = Bytes("buy")
    # This function creates a new product
    def application_creation(self):
        return Seq([
            Assert(Txn.note() == Bytes("tutorial-marketplace:uv1")),
            # Checks that the number of input arguments sent is equal to four
            ## Checks the input data to ensure that they meet certain criterias
            Assert(
                And(
                    Txn.application_args.length() == Int(4),
                    Txn.note() == Bytes("aucspace:uv1"),
                    Len(Txn.application_args[0]) > Int(0),
                    Len(Txn.application_args[1]) > Int(0),
                    Len(Txn.application_args[2]) > Int(0),
                    Btoi(Txn.application_args[3]) > Int(0),
                )
            ),
            # store txn arguments in global state
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.description, Txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.sold, Int(0)),
            Approve()
        ])
    # This function allows users to buy a product from the marketplace
    def buy(self):
        count = Txn.application_args[1]
        valid_number_of_transactions = Global.group_size() == Int(2)
        # Sanity checks to prevent unexpected scenarios and misleading state changes
        valid_payment_to_seller = And(
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == Global.creator_address(),
            Gtxn[1].amount() == App.globalGet(self.Variables.price) * Btoi(count),
            Gtxn[1].sender() == Gtxn[0].sender(),
            # - User is not creator
            Gtxn[1].sender() != Global.creator_address(),
        )

        can_buy = And(valid_number_of_transactions,
                      valid_payment_to_seller)

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
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()]
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
