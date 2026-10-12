'use client';

import React from 'react';
import { BirthProfile } from '@/lib/types';
import { isValidGregorianDate, isValidCoordinates, resolveCityCoordinates } from '@/lib/validation';

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProfile: (p: BirthProfile) => Promise<void>;
  isVietnamese: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  isOpen,
  onClose,
  onSubmitProfile,
  isVietnamese
}) => {
  const [name, setName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [isTimeUnknown, setIsTimeUnknown] = React.useState(false);
  const [hour, setHour] = React.useState('');
  const [minute, setMinute] = React.useState('');
  const [locationName, setLocationName] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [useLmt, setUseLmt] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const loadDemoEinstein = () => {
    setName('Albert Einstein');
    setYear('1879');
    setMonth('3');
    setDay('14');
    setIsTimeUnknown(false);
    setHour('11');
    setMinute('30');
    setLocationName('Ulm, Germany');
    setLatitude('48.40');
    setLongitude('9.99');
    setUseLmt(true);
    setErrorMsg(null);
  };

  const handleCityBlur = () => {
    if (!locationName) return;
    const resolved = resolveCityCoordinates(locationName);
    if (resolved) {
      if (!latitude) setLatitude(resolved.lat.toFixed(2));
      if (!longitude) setLongitude(resolved.lon.toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (!isValidGregorianDate(y, m, d)) {
      setErrorMsg(isVietnamese ? 'Ngày tháng sinh Dương lịch không hợp lệ.' : 'Please enter a valid Gregorian birth date.');
      return;
    }

    let h: number | null = null;
    let min: number | null = null;
    if (!isTimeUnknown) {
      if (hour === '' || minute === '') {
        setErrorMsg(isVietnamese ? 'Vui lòng nhập giờ sinh hoặc chọn "Tôi không rõ giờ sinh".' : 'Please provide birth time or select "I don\'t know my birth time".');
        return;
      }
      h = parseInt(hour);
      min = parseInt(minute);
      if (isNaN(h) || isNaN(min) || h < 0 || h > 23 || min < 0 || min > 59) {
        setErrorMsg(isVietnamese ? 'Giờ sinh phải từ 0-23, phút từ 0-59.' : 'Birth hour must be 0-23, minute 0-59.');
        return;
      }
    }

    let lat = parseFloat(latitude);
    let lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      const resolved = resolveCityCoordinates(locationName);
      if (resolved) {
        lat = resolved.lat;
        lon = resolved.lon;
      }
    }

    if (!isValidCoordinates(lat, lon)) {
      setErrorMsg(isVietnamese ? 'Vui lòng nhập tọa độ (Vĩ độ & Kinh độ) hợp lệ.' : 'Please enter valid latitude and longitude coordinates.');
      return;
    }

    setLoading(true);
    try {
      await onSubmitProfile({
        name: name.trim() || 'Anonymous Subject',
        year: y,
        month: m,
        day: d,
        hour: h,
        minute: min,
        isTimeUnknown,
        latitude: lat,
        longitude: lon,
        locationName: locationName.trim() || 'Specified Coordinates',
        useLmt
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Calculation error';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <dialog
        className={`calc-drawer ${isOpen ? 'open' : ''}`}
        id="calc-drawer"
        aria-labelledby="calc-drawer-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <h3 id="calc-drawer-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500 }}>
              {isVietnamese ? 'Lập Bản Đồ Cuộc Đời' : 'Calculate Life Map'}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
              Deterministic Lunisolar & Planetary Calculation
            </div>
          </div>
          <button
            className="close-drawer-btn"
            id="btn-close-calc"
            type="button"
            onClick={onClose}
            aria-label="Close Profile Drawer"
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', color: 'var(--moon-ivory)', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            id="btn-load-demo-profile"
            onClick={loadDemoEinstein}
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            📋 {isVietnamese ? 'Tải dữ liệu mẫu Albert Einstein' : 'Load Albert Einstein Demo Parameters'}
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--rose-accent)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--rose-accent)', marginBottom: '1.25rem' }}>
            ⚠ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="form-name">
              {isVietnamese ? 'Họ và Tên' : 'Subject Name'}
            </label>
            <input
              type="text"
              id="form-name"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marie Curie"
              required
            />
          </div>

          <div className="form-group">
            <span className="form-label">{isVietnamese ? 'Ngày Sinh (Dương Lịch)' : 'Birth Date (Gregorian)'}</span>
            <div className="form-row">
              <div>
                <input
                  type="number"
                  id="form-year"
                  className="text-input"
                  placeholder="YYYY"
                  min="1400"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="form-month"
                  className="text-input"
                  placeholder="MM (1-12)"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="form-day"
                  className="text-input"
                  placeholder="DD (1-31)"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="form-label" style={{ marginBottom: 0 }}>
                {isVietnamese ? 'Giờ Sinh' : 'Birth Time'}
              </span>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="form-time-unknown"
                  checked={isTimeUnknown}
                  onChange={(e) => setIsTimeUnknown(e.target.checked)}
                />
                {isVietnamese ? 'Không rõ giờ sinh' : "I don't know my birth time"}
              </label>
            </div>

            {!isTimeUnknown && (
              <div className="form-row-2">
                <div>
                  <input
                    type="number"
                    id="form-hour"
                    className="text-input"
                    placeholder="Hour (0-23)"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    id="form-min"
                    className="text-input"
                    placeholder="Minute (0-59)"
                    min="0"
                    max="59"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                  />
                </div>
              </div>
            )}

            {isTimeUnknown && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                {isVietnamese
                  ? 'Ghi chú: Khi không có giờ sinh, Cung Mọc (Ascendant) và trụ giờ Bát Tự sẽ được đánh dấu không xác định.'
                  : 'Note: Without birth time, house cusps (Ascendant/Midheaven) will be marked uncertain.'}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="form-loc">
              {isVietnamese ? 'Nơi Sinh (Thành Phố / Quốc Gia)' : 'City / Birthplace'}
            </label>
            <input
              type="text"
              id="form-loc"
              className="text-input"
              placeholder="e.g. London, UK"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              onBlur={handleCityBlur}
              style={{ marginBottom: '0.75rem' }}
            />
            <div className="form-row-2">
              <div>
                <input
                  type="number"
                  step="0.01"
                  id="form-lat"
                  className="text-input"
                  placeholder="Latitude (e.g. 51.50)"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  id="form-lon"
                  className="text-input"
                  placeholder="Longitude (e.g. -0.12)"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="form-use-lmt"
                  checked={useLmt}
                  onChange={(e) => setUseLmt(e.target.checked)}
                />
                {isVietnamese ? 'Áp dụng Giờ Mặt Trời Trung Bình Lịch Sử (LMT)' : 'Historical Local Mean Time (LMT)'}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.25rem' }}
          >
            {loading
              ? (isVietnamese ? 'Đang tính toán các hệ thống...' : 'Computing Multi-System Engines...')
              : (isVietnamese ? 'Lập Bản Đồ Cuộc Đời' : 'Generate Editorial Life Map')}
          </button>
        </form>
      </dialog>
    </>
  );
};
