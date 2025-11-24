import { describe, it, expect } from 'vitest'
import { validateCPF, validateCNPJ } from './validators'

describe('validateCPF', () => {
  it('should validate correct CPF', () => {
    expect(validateCPF('123.456.789-09')).toBe(true)
    expect(validateCPF('111.444.777-35')).toBe(true)
  })

  it('should validate CPF without formatting', () => {
    expect(validateCPF('12345678909')).toBe(true)
  })

  it('should reject invalid CPF', () => {
    expect(validateCPF('123.456.789-00')).toBe(false)
    expect(validateCPF('111.111.111-11')).toBe(false)
  })

  it('should reject CPF with all same digits', () => {
    expect(validateCPF('000.000.000-00')).toBe(false)
    expect(validateCPF('111.111.111-11')).toBe(false)
    expect(validateCPF('999.999.999-99')).toBe(false)
  })

  it('should reject CPF with wrong length', () => {
    expect(validateCPF('123.456.789')).toBe(false)
    expect(validateCPF('12345')).toBe(false)
  })

  it('should handle empty string', () => {
    expect(validateCPF('')).toBe(false)
  })

  it('should handle invalid characters', () => {
    expect(validateCPF('abc.def.ghi-jk')).toBe(false)
  })
})

describe('validateCNPJ', () => {
  it('should validate correct CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true)
  })

  it('should validate CNPJ without formatting', () => {
    expect(validateCNPJ('11222333000181')).toBe(true)
  })

  it('should reject invalid CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-00')).toBe(false)
  })

  it('should reject CNPJ with all same digits', () => {
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false)
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false)
  })

  it('should reject CNPJ with wrong length', () => {
    expect(validateCNPJ('11.222.333')).toBe(false)
    expect(validateCNPJ('12345')).toBe(false)
  })

  it('should handle empty string', () => {
    expect(validateCNPJ('')).toBe(false)
  })
})
