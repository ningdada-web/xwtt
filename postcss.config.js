module.exports={
    Plugins: {
        'postcss-pxtorem': {
            //px转为rem
            //rootValue:转换px基准值
            //编码时，一个元素宽为75px，换成rem为2rem
            rootValue: 37.5,
            propList: ['*']
        }
    }
}