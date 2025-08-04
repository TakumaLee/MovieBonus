import { Movie, MovieStatus } from '@/lib/types';
import { isAfter, isBefore, addMonths } from 'date-fns';

/**
 * 根據電影的資料庫狀態或上映日期和下檔日期計算狀態
 * 優先使用資料庫中的狀態，只有在缺失時才使用日期計算
 * @param movie - 電影物件
 * @returns 電影狀態：showing | coming_soon | ended
 */
export function getMovieStatus(movie: Movie): MovieStatus {
  // 定義有效的狀態值
  const validStatuses: MovieStatus[] = ['showing', 'coming_soon', 'ended'];
  
  // 優先使用資料庫中的狀態（如果存在且有效）
  if (movie.status && validStatuses.includes(movie.status)) {
    return movie.status;
  }
  
  // 如果資料庫狀態無效或缺失，使用日期計算作為後備方案
  const today = new Date();
  const releaseDate = movie.release_date ? new Date(movie.release_date) : null;
  const endDate = movie.end_date ? new Date(movie.end_date) : null;
  
  // 如果有明確的下檔日期
  if (endDate && isBefore(endDate, today)) {
    return 'ended';
  }
  
  // 如果有上映日期
  if (releaseDate) {
    // 還沒上映
    if (isAfter(releaseDate, today)) {
      return 'coming_soon';
    }
    
    // 如果沒有下檔日期，但已經上映超過3個月，視為已下檔
    if (!endDate && isBefore(addMonths(releaseDate, 3), today)) {
      return 'ended';
    }
    
    // 正在上映
    return 'showing';
  }
  
  // 如果沒有任何資訊，默認為正在上映
  return 'showing';
}

/**
 * 取得狀態對應的 Badge variant
 * @param status - 電影狀態
 * @returns Badge variant
 */
export function getStatusVariant(status: MovieStatus) {
  switch (status) {
    case 'showing':
      return 'default';
    case 'coming_soon':
      return 'secondary';
    case 'ended':
      return 'outline';
    default:
      return 'default';
  }
}

/**
 * 取得狀態對應的顯示文字
 * @param status - 電影狀態
 * @returns 顯示文字
 */
export function getStatusText(status: MovieStatus) {
  switch (status) {
    case 'showing':
      return '上映中';
    case 'coming_soon':
      return '即將上映';
    case 'ended':
      return '已下檔';
    default:
      return status;
  }
}

/**
 * 判斷電影是否正在上映
 * @param movie - 電影物件
 * @returns 是否正在上映
 */
export function isMovieShowing(movie: Movie): boolean {
  return getMovieStatus(movie) === 'showing';
}

/**
 * 判斷電影是否即將上映
 * @param movie - 電影物件
 * @returns 是否即將上映
 */
export function isMovieComingSoon(movie: Movie): boolean {
  return getMovieStatus(movie) === 'coming_soon';
}

/**
 * 判斷電影是否已下檔
 * @param movie - 電影物件
 * @returns 是否已下檔
 */
export function isMovieEnded(movie: Movie): boolean {
  return getMovieStatus(movie) === 'ended';
}