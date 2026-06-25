'use client';

import { useState } from 'react';

interface BirthInfoFormProps {
  onSubmit: (data: {
    name: string;
    gender: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    bloodType: string;
  }) => void;
  onClose: () => void;
}

export default function BirthInfoForm({ onSubmit, onClose }: BirthInfoFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [birthYear, setBirthYear] = useState('1990');
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');
  const [birthHour, setBirthHour] = useState('12');
  const [bloodType, setBloodType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      gender,
      birthYear: parseInt(birthYear),
      birthMonth: parseInt(birthMonth),
      birthDay: parseInt(birthDay),
      birthHour: parseInt(birthHour),
      bloodType,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-bg-card)',
          borderRadius: '16px',
          padding: '28px 24px',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>🔓</p>
        <p
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: '4px',
          }}
        >
          解锁完整报告
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.4,
          }}
        >
          输入你的出生信息，生成专属的五行能量报告
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 姓名 */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
              称呼
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入你的名字"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '15px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 性别 */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
              性别
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { value: 'male', label: '男' },
                { value: 'female', label: '女' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '15px',
                    borderRadius: '10px',
                    border: `1.5px solid ${gender === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: gender === opt.value ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    color: gender === opt.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: gender === opt.value ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 出生年月日时 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
                出生年
              </label>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                min="1900"
                max="2025"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
                出生月
              </label>
              <input
                type="number"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                min="1"
                max="12"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
                出生日
              </label>
              <input
                type="number"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                min="1"
                max="31"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
                出生时辰
              </label>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="23">子时 (23:00-00:59)</option>
                <option value="1">丑时 (01:00-02:59)</option>
                <option value="3">寅时 (03:00-04:59)</option>
                <option value="5">卯时 (05:00-06:59)</option>
                <option value="7">辰时 (07:00-08:59)</option>
                <option value="9">巳时 (09:00-10:59)</option>
                <option value="11">午时 (11:00-12:59)</option>
                <option value="13">未时 (13:00-14:59)</option>
                <option value="15">申时 (15:00-16:59)</option>
                <option value="17">酉时 (17:00-18:59)</option>
                <option value="19">戌时 (19:00-20:59)</option>
                <option value="21">亥时 (21:00-22:59)</option>
              </select>
            </div>
          </div>

          {/* 血型 */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
              血型（可选）
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['A', 'B', 'O', 'AB'].map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setBloodType(bloodType === bt ? '' : bt)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${bloodType === bt ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: bloodType === bt ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    color: bloodType === bt ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: bloodType === bt ? 600 : 400,
                  }}
                >
                  {bt}型
                </button>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              选填。血型与五行联动分析更精准。
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: '4px',
              opacity: name.trim() ? 1 : 0.6,
            }}
            disabled={!name.trim()}
          >
            生成完整报告
          </button>
        </form>
      </div>
    </div>
  );
}
