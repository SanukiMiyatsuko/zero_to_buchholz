import { expect, test } from 'vitest'
import { trans, Z, termToString } from './code.ts'
import { Scanner } from './parse.ts';

const options = {
  checkOnOffo: false,
  checkOnOffO: false,
  checkOnOffA: false,
  checkOnOffB: false,
  checkOnOffT: false,
}

test('truns(0) === 0', () => {
  expect(trans(Z)).toStrictEqual(Z)
})

test('truns(1) === 1', () => {
  const x = new Scanner("1").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("1")
})

test('truns(w) === ψ_0(1)', () => {
  const x = new Scanner("w").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(1)")
})

test('truns(a(w)) === ψ_0(ψ_0(1))', () => {
  const x = new Scanner("a(w)").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_0(1))")
})

test('truns(a(w+1)) === ψ_0(ψ_0(1)+1)', () => {
  const x = new Scanner("a(w+1)").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_0(1)+1)")
})

test('truns(a(a(1,0))) === ψ_0(ψ_1(0))', () => {
  const x = new Scanner("a(a(1,0))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0))")
})

test('truns(a(a(1,0)+a(1))) === ψ_0(ψ_1(0)+ψ_0(1))', () => {
  const x = new Scanner("a(a(1,0)+a(1))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(1))")
})

test('truns(a(a(1,0)+a(a(1)))) === ψ_0(ψ_1(0)+ψ_0(ψ_0(1)))', () => {
  const x = new Scanner("a(a(1,0)+a(a(1)))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(ψ_0(1)))")
})

test('truns(a(a(1,0)+a(a(1,0)))) === ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))', () => {
  const x = new Scanner("a(a(1,0)+a(a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))")
})

test('truns(a(a(1,0)+a(a(1,0)+a(a(1,0))))) === ψ_0(ψ_1(0)+ψ_0(ψ_1(0)+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(1,0)+a(a(1,0)+a(a(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(ψ_1(0)+ψ_0(ψ_1(0))))")
})

test('truns(a(a(1,0)+a(1,0))) === ψ_0(ψ_1(0)+ψ_1(0))', () => {
  const x = new Scanner("a(a(1,0)+a(1,0))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_1(0))")
})

test('truns(a(a(1,1))) === ψ_0(ψ_1(1))', () => {
  const x = new Scanner("a(a(1,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(1))")
})

test('truns(a(a(1,a(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(1,a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(a(a(1,a(1,0))+a(1,0))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0))', () => {
  const x = new Scanner("a(a(1,a(1,0))+a(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0))")
})

test('truns(a(a(1,a(1,0))+a(1,0)+a(1,0))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0)+ψ_1(0))', () => {
  const x = new Scanner("a(a(1,a(1,0))+a(1,0)+a(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0)+ψ_1(0))")
})

test('truns(a(a(1,a(1,0))+a(1,1))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(1))', () => {
  const x = new Scanner("a(a(1,a(1,0))+a(1,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(1))")
})

test('truns(a(a(1,a(1,0))+a(1,w))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(1)))', () => {
  const x = new Scanner("a(a(1,a(1,0))+a(1,w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(1)))")
})

test('truns(a(a(1,a(1,0))+a(1,a(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(1,a(1,0))+a(1,a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(a(a(1,a(1,0))+a(1,a(1,0))+a(1,a(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(1,a(1,0))+a(1,a(1,0))+a(1,a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(a(a(1,a(1,0)+1))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+1))', () => {
  const x = new Scanner("a(a(1,a(1,0)+1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+1))")
})

test('truns(a(a(1,a(1,0)+2))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+2))', () => {
  const x = new Scanner("a(a(1,a(1,0)+2))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+2))")
})

test('truns(a(a(1,a(1,0)+w))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(1)))', () => {
  const x = new Scanner("a(a(1,a(1,0)+w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(1)))")
})

test('truns(a(a(1,a(1,0)+a(a(1,0))))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(1,a(1,0)+a(a(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(ψ_1(0))))")
})

test('truns(a(a(1,a(1,0)+a(a(1,0)+1)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+1)))', () => {
  const x = new Scanner("a(a(1,a(1,0)+a(a(1,0)+1)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+1)))")
})

test('truns(a(a(1,a(1,0)+a(a(1,0)+w)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(1))))', () => {
  const x = new Scanner("a(a(1,a(1,0)+a(a(1,0)+w)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(1))))")
})

test('truns(a(a(1,a(1,0)+a(a(1,0)+a(a(1,0)))))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))', () => {
  const x = new Scanner("a(a(1,a(1,0)+a(a(1,0)+a(a(1,0)))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))")
})

test('truns(a(a(1,a(1,0)+a(a(1,0)+a(a(1,0)))))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))', () => {
  const x = new Scanner("a(a(1,a(1,0)+a(a(1,0)+a(a(1,0)))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))")
})

test('truns(a(a(1,a(1,0)+a(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_1(0))))', () => {
  const x = new Scanner("a(a(1,a(1,0)+a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_1(0))))")
})

test('truns(a(a(1,a(1,1)))) === ψ_0(ψ_1(ψ_0(ψ_1(1))))', () => {
  const x = new Scanner("a(a(1,a(1,1)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(1))))")
})

test('truns(a(a(1,a(1,w)))) === ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(1)))))', () => {
  const x = new Scanner("a(a(1,a(1,w)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(1)))))")
})

test('truns(a(a(1,a(1,a(1,0))))) === ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))', () => {
  const x = new Scanner("a(a(1,a(1,a(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))")
})

test('truns(a(a(2,0))) === ψ_0(ψ_1(ψ_1(0)))', () => {
  const x = new Scanner("a(a(2,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)))")
})

test('truns(a(a(2,0)+a(a(2,0)))) === ψ_0(ψ_1(ψ_1(0))+ψ_0(ψ_1(ψ_1(0))))', () => {
  const x = new Scanner("a(a(2,0)+a(a(2,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_0(ψ_1(ψ_1(0))))")
})

test('truns(a(a(2,0)+a(1,0))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(0))', () => {
  const x = new Scanner("a(a(2,0)+a(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(0))")
})

test('truns(a(a(2,0)+a(1,0)+a(1,0))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(0)+ψ_1(0))', () => {
  const x = new Scanner("a(a(2,0)+a(1,0)+a(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(0)+ψ_1(0))")
})

test('truns(a(a(2,0)+a(1,1))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(1))', () => {
  const x = new Scanner("a(a(2,0)+a(1,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(1))")
})

test('truns(a(a(2,0)+a(1,w))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(1)))', () => {
  const x = new Scanner("a(a(2,0)+a(1,w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(1)))")
})

test('truns(a(a(2,0)+a(1,a(1,0)))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(2,0)+a(1,a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(a(a(2,0)+a(1,a(1,a(1,0))))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))', () => {
  const x = new Scanner("a(a(2,0)+a(1,a(1,a(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))")
})

test('truns(a(a(2,0)+a(1,a(2,0)))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))', () => {
  const x = new Scanner("a(a(2,0)+a(1,a(2,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))")
})

test('truns(a(a(2,0)+a(1,a(2,0)+a(1,a(2,0))))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))))', () => {
  const x = new Scanner("a(a(2,0)+a(1,a(2,0)+a(1,a(2,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))))")
})

test('truns(a(a(2,0)+a(2,0))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_1(0)))', () => {
  const x = new Scanner("a(a(2,0)+a(2,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_1(0)))")
})

test('truns(a(a(2,1))) === ψ_0(ψ_1(ψ_1(0)+1))', () => {
  const x = new Scanner("a(a(2,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+1))")
})

test('truns(a(a(2,w))) === ψ_0(ψ_1(ψ_1(0)+ψ_0(1)))', () => {
  const x = new Scanner("a(a(2,w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+ψ_0(1)))")
})

test('truns(a(a(2,a(1,0)))) === ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("a(a(2,a(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(0))))")
})

test('truns(a(a(2,a(1,a(1,0))))) === ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(ψ_0(ψ_1(0))))))', () => {
  const x = new Scanner("a(a(2,a(1,a(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(ψ_0(ψ_1(0))))))")
})

test('truns(a(a(2,a(1,a(1,a(1,0)))))) === ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))))', () => {
  const x = new Scanner("a(a(2,a(1,a(1,a(1,0)))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))))")
})

test('truns(a(a(2,a(2,0)))) === ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(ψ_1(0)))))', () => {
  const x = new Scanner("a(a(2,a(2,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+ψ_0(ψ_1(ψ_1(0)))))")
})

test('truns(a(a(3,0))) === ψ_0(ψ_1(ψ_1(0)+ψ_1(0)))', () => {
  const x = new Scanner("a(a(3,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)+ψ_1(0)))")
})

test('truns(a(a(w,0))) === ψ_0(ψ_1(ψ_1(1)))', () => {
  const x = new Scanner("a(a(w,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(1)))")
})

test('truns(a(a(a(1,0),0))) === ψ_0(ψ_1(ψ_1(ψ_0(ψ_1(0)))))', () => {
  const x = new Scanner("a(a(a(1,0),0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(ψ_0(ψ_1(0)))))")
})