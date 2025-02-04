// ψの準備
export type ZT = { readonly type: "zero" };
export type RAT_B = { readonly type: "plus", readonly add: RPT_B[] };
export type RPT_B = { readonly type: "psi", readonly sub: "0" | "1", readonly arg: RT_B };
export type RT_B = ZT | RAT_B | RPT_B;

export const Z: ZT = { type: "zero" };
export const ONE_B: RPT_B = { type: "psi", sub: "0", arg: Z };

// オブジェクトの相等判定
export function equal(s: RT_B, t: RT_B): boolean {
    if (s.type === "zero") {
        return t.type === "zero";
    } else if (s.type === "plus") {
        if (t.type !== "plus") return false;
        if (t.add.length !== s.add.length) return false;
        for (let i = 0; i < t.add.length; i++) {
            if (!equal(s.add[i], t.add[i])) return false;
        }
        return true;
    } else {
        if (t.type !== "psi") return false;
        return (s.sub === t.sub) && equal(s.arg, t.arg);
    }
}

export function psi(sub: "0" | "1", arg: RT_B): RPT_B {
    return { type: "psi", sub: sub, arg: arg };
}

// a+b を適切に整形して返す
export function plus(a: RT_B, b: RT_B): RT_B {
    if (a.type === "zero") {
        return b;
    } else if (a.type === "plus") {
        if (b.type === "zero") {
            return a;
        } else if (b.type === "plus") {
            return { type: "plus", add: a.add.concat(b.add) };
        } else {
            return { type: "plus", add: [...a.add, b] };
        }
    } else {
        if (b.type === "zero") {
            return a;
        } else if (b.type === "plus") {
            return { type: "plus", add: [a, ...b.add] };
        } else {
            return { type: "plus", add: [a, b] };
        }
    }
}

// 要素が1個の配列は潰してから返す
export function sanitize_plus_term_B(add: RPT_B[]): RPT_B | RAT_B {
    if (add.length === 1) {
        return add[0];
    } else {
        return { type: "plus", add: add };
    }
}

// s < t を判定
export function less_than(s: RT_B, t: RT_B): boolean {
    if (s.type === "zero") {
        return t.type !== "zero";
    } else if (s.type === "psi") {
        if (t.type === "zero") {
            return false;
        } else if (t.type === "psi") {
            return (s.sub < t.sub) ||
                ((s.sub === t.sub) && less_than(s.arg, t.arg));
        } else {
            return equal(s, t.add[0]) || less_than(s, t.add[0]);
        }
    } else {
        if (t.type === "zero") {
            return false;
        } else if (t.type === "psi") {
            return less_than(s.add[0], t)
        } else {
            const s2 = sanitize_plus_term_B(s.add.slice(1));
            const t2 = sanitize_plus_term_B(t.add.slice(1));
            return less_than(s.add[0], t.add[0]) ||
                (equal(s.add[0], t.add[0]) && less_than(s2, t2));
        }
    }
}

// 左にある小さいのを消す
function standardisation(s: RT_B): RT_B {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        const standarded = [s.add[s.add.length - 1]];
        for (let i = s.add.length - 2; i > -1; i--) {
            if (!less_than(s.add[i], standarded[standarded.length-1])) standarded.push(s.add[i]);
        }
        return sanitize_plus_term_B(standarded.reverse());
    } else {
        return s;
    }
}

// nより大きい方
function ptL(s: RT_B): RT_B {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        const a = s.add[0];
        const b = sanitize_plus_term_B(s.add.slice(1));
        return plus(ptL(a), ptL(b));
    } else {
        const a = s.sub;
        if (a === "1") return s;
        return Z;
    }
}

// nより小さい方
function ptS(s: RT_B): RT_B {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        const a = s.add[0];
        const b = sanitize_plus_term_B(s.add.slice(1));
        return plus(ptS(a), ptS(b));
    } else {
        const a = s.sub;
        if (a === "1") return Z;
        return s;
    }
}

// 早めの崩壊
function ec(s: RT_B): RT_B {
    if (equal(ptL(s), Z)) {
        return s;
    } else {
        return standardisation(plus(psi("0",ptL(s)), ptS(s)));
    }
}

// 基数の乗法
function ct(n: number, s: RT_B): RT_B {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        const a = s.add[0];
        const b = sanitize_plus_term_B(s.add.slice(1));
        return plus(ct(n, a), ct(n, b));
    } else {
        if (n === 0) return s;
        const a = s.sub;
        const b = s.arg;
        function from_nat(num: number): RT_B {
            if (num === 0) return Z;
            const numterm: RPT_B[] = [];
            while (num > 0) {
                numterm.push(ONE_B);
                num--;
            }
            return sanitize_plus_term_B(numterm);
        }
        if (a === "0") return psi("1", plus(ct(1, from_nat(n-1)) ,ec(b)));
        return psi("1", standardisation(plus(ct(1, from_nat(n)), b)));
    }
}

// 亜関数の準備
// ===========================================

export type AT_S = { readonly type: "plus", readonly add: PT_S[] };
export type PT_S = { readonly type: "sub", readonly arr: T_S[] };
export type T_S = ZT | AT_S | PT_S;

export const ONE_S: PT_S = { type: "sub", arr: [Z] };
export const OMEGA_S: PT_S = { type: "sub", arr: [ONE_S] };
export const LOMEGA_S: PT_S = { type: "sub", arr: [Z, ONE_S] };
export const IOTA_S: PT_S = { type: "sub", arr: [Z, Z, ONE_S] };

export function subs(arr: T_S[]): PT_S {
    return { type: "sub", arr: arr };
}

// 要素が1個の配列は潰してから返す
export function sanitize_plus_term_S(add: PT_S[]): PT_S | AT_S {
    if (add.length === 1) {
        return add[0];
    } else {
        return { type: "plus", add: add };
    }
}

// 本編
// ===========================================

export function trans(s: T_S): RT_B {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        const a = s.add[0];
        const b = sanitize_plus_term_S(s.add.slice(1));
        return plus(trans(a), trans(b));
    } else {
        const a = s.arr;
        let k_max = a.length-1;
        while (k_max > -1) {
            if (a[k_max].type !== "zero") break;
            k_max--;
        }
        if (k_max === -1) return ONE_B;
        else if (k_max === 0) return psi("0", trans(a[0]));
        else {
            const tarmList = [];
            for (let i = k_max; i > -1; i--) {
                tarmList.push(ct(i, ec(trans(a[i]))));
            }
            return psi("0", standardisation(tarmList.reduce((accumulator, currentValue) => plus(accumulator, currentValue))));
        }
    }
}

// 翻訳
// ==========================================

export type Options = {
    checkOnOffo: boolean;
    checkOnOffO: boolean;
    checkOnOffA: boolean;
    checkOnOffB: boolean;
    checkOnOffT: boolean;
};

// オブジェクトから文字列へ
function term_to_string(t: RT_B, options: Options): string {
    if (t.type === "zero") {
        return "0";
    } else if (t.type === "psi") {
        if (!(options.checkOnOffB && t.sub === "0")) {
            if (options.checkOnOffA) {
                return "ψ(" + t.sub + "," + term_to_string(t.arg, options) + ")";
            }
            if (options.checkOnOffT)
                return "ψ_{" + t.sub + "}(" + term_to_string(t.arg, options) + ")";
            return "ψ_" + t.sub + "(" + term_to_string(t.arg, options) + ")";
        }
        return "ψ(" + term_to_string(t.arg, options) + ")";
    } else {
        return t.add.map((x) => term_to_string(x, options)).join("+");
    }
}

function to_TeX(str: string): string {
    str = str.replace(/ψ/g, "\\psi");
    str = str.replace(/ω/g, "\\omega");
    str = str.replace(/Ω/g, "\\Omega");
    return str;
}

function abbrviate(str: string, options: Options): string {
    str = str.replace(RegExp("ψ\\(0\\)", "g"), "1");
    str = str.replace(RegExp("ψ_\\{0\\}\\(0\\)", "g"), "1");
    str = str.replace(RegExp("ψ_0\\(0\\)", "g"), "1");
    str = str.replace(RegExp("ψ\\(0,0\\)", "g"), "1");
    if (options.checkOnOffo) {
        str = str.replace(RegExp("ψ\\(1\\)", "g"), "ω");
        str = str.replace(RegExp("ψ_\\{0\\}\\(1\\)", "g"), "ω");
        str = str.replace(RegExp("ψ_0\\(1\\)", "g"), "ω");
        str = str.replace(RegExp("ψ\\(0,1\\)", "g"), "ω");
    }
    if (options.checkOnOffO) {
        str = str.replace(RegExp("ψ_\\{1\\}\\(0\\)", "g"), "Ω");
        str = str.replace(RegExp("ψ_1\\(0\\)", "g"), "Ω");
        str = str.replace(RegExp("ψ\\(1,0\\)", "g"), "Ω");
    }
    if (options.checkOnOffT) str = to_TeX(str);
    while (true) {
        const numterm = str.match(/1(\+1)+/);
        if (!numterm) break;
        const matches = numterm[0].match(/1/g);
        if (!matches) throw Error("そんなことある？");
        const count = matches.length;
        str = str.replace(numterm[0], count.toString());
    }
    return str;
}

export function termToString(t: RT_B, options: Options): string {
    return abbrviate(term_to_string(t, options), options);
}