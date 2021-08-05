const str = 'abcacabcbcbacabc'
export function bm(b: string, a: string = str) {
    const m = b.length;// 模式串长度
    const n = a.length;//主串长度
    const bc = generateBC(b);
    let i = 0;//主串与模式串对齐的第一个字符

    const {prefix, suffix} = generateGS(b);
    while (i <= n - m) {
        let j; //坏字符的索引
        for (j = m - 1; j >= 0; j--) {
            if (a[i + j] !== b[j]) {
                break;
            }
        }
        if (j < 0) {
            return i
        }
        //  这里等同于将模式串往后滑动j-bc[(int)a[i+j]]位
        let x = j - bc[a.charCodeAt(i + j)]
        let y = 0;
        if (j < m - 1) {
            y = moveByGS(j, m, prefix, suffix)
        }
        i = i + Math.max(x, y)

    }
    return -1
}
function generateBC(needle: string) {
    const size = 256;
    const bc = new Array(size).fill(-1);
    for (let i = 0; i < needle.length; i++) {
        const ascii = needle.charCodeAt(i)
        bc[ascii] = i;
    }
    // bc 存储每个字符最后一次出现的位置
    return bc
}


// function moveByGS(badCharStartIndex: number, patternLength: number, suffix: number[], prefix: any[]) {
//     let k = patternLength - badCharStartIndex - 1 // 好后缀长度
//     // 完全匹配
//     if (suffix[k] !== -1) {
//         return badCharStartIndex - suffix[k] + 1
//     }
//     // 部分匹配
//     for (let r = badCharStartIndex + 2; r <= patternLength - 1; r++) {
//         if (prefix[patternLength - r]) {
//             return r
//         }
//     }
//     return patternLength
// }
function generateGS(b: string) {
    const m = b.length;

    const prefix = new Array(m).fill(-1);   // 存储有没有前缀子串匹配后缀字串

    const suffix = new Array(m).fill(false);   //存储最后一个 {u*} 的坐标
    for (let i = 0; i < m; i++) {
        let j = i;
        let k = 0;
        while (j >= 0 && b[j] === b[m - 1 - k]) {
            j--;
            k++;
            suffix[k] = j + 1;
        }
        if (j === -1) {
            prefix[k] = true;
        }
    }
    return {prefix, suffix};
}
function moveByGS(j: any, m: any, prefix: any, suffix: any) {
    const k = m - 1 - j;
    if (!suffix[k]) {
        return j - suffix[k] + 1; // 把{u*}移动到{u}
    }
    for (let r = j + 2; r < m; r++) {
        if (prefix[m - r]) {
            return r
        }
    }
    return m
}