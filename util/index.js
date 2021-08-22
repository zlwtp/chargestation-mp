export const dedupe = array => {
    return Array.from(new Set(array))
}
export const formatDate = value => {
    let date = new Date(value)
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes()
    m = m < 10 ? '0' + m : m
    let s = date.getSeconds()
    s = s < 10 ? '0' + s : s
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}
export const formTime = time => {
    let b = time.split('.')
    let x = b[0]

    let y = b[1]
    if (y.length == 1) {
        y = Math.ceil(y * 6)
    }
    if (y.length == 2) {
        y = Math.ceil(y * 0.6)
    }
    if (y.length == 3) {
        y = Math.ceil(y * 0.06)
    }
    return x + '小时' + y + '分钟'
}
//阿拉伯数字转中文数字
export const NoToChinese = num => {
    if (!/^\d*(\.\d*)?$/.test(num)) {
        alert('Number is wrong!')
        return 'Number is wrong!'
    }
    var AA = new Array(
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九'
    )
    var BB = new Array('', '十', '百', '千', '万', '亿', '点', '')
    var a = ('' + num).replace(/(^0*)/g, '').split('.'),
        k = 0,
        re = ''
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0:
                re = BB[7] + re
                break
            case 4:
                if (
                    !new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(
                        a[0]
                    )
                )
                    re = BB[4] + re
                break
            case 8:
                re = BB[5] + re
                BB[7] = BB[5]
                k = 0
                break
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
            re = AA[0] + re
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
        k++
    }
    if (a.length > 1) {
        //加上小数部分(如果有小数部分)
        re += BB[6]
        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]
    }
    return re
}
//计算时间差（相差分钟）

export const timeDifference = (startTime, endTime) => {
    let start1 = startTime.split(':')
    let startAll = parseInt(start1[0] * 60) + parseInt(start1[1])
    let end1 = endTime.split(':')
    let endAll = parseInt(end1[0] * 60) + parseInt(end1[1])
    let minutes = endAll - startAll
    if (minutes < 0) {
        minutes = 1440 + minutes
    }
    return [Math.floor(minutes / 60), minutes % 60]
}
