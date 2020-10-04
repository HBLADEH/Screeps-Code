// Game.market.createOrder({
//   type: ORDER_SELL,
//   resourceType: 'L',
//   price: 0.100,
//   totalAmount: 5000,
//   roomName: "W31S41"   
// });

// Game.market.deal('5ea01992d77e508bd57c3ab5', 2000, "W31S41");
const structureSetting = require("./setting.structure");
module.exports = () => {
//   console.log(123)

    if (Game.cpu.bucket >= 8000) {
        Game.cpu.generatePixel()
    }
    
    var terminal1 = Game.rooms[structureSetting.Room1].terminal;
    let myprice = '0.165'
    if (terminal1.store[RESOURCE_ENERGY]>8000) {
        var orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY}); // 更快
        orders.sort((a,b) => b.price - a.price)
        var order = orders[0]
        if (order.price >= myprice) {
            var myamout = 0
            if (order.amount <= terminal1.store[RESOURCE_ENERGY]) {
                myamout = order.amount
            } else {
                myamout = terminal1.store[RESOURCE_ENERGY]
            }
            Game.market.deal(order.id, myamout, structureSetting.Room1)
        }
        
    }
};
