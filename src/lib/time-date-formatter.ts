export function getFormattedDateTime(
  userDate?: string,
  userTime?: string
): { fDate: string; fTime: string } {
  const now = new Date();

  let date: Date;

  // Если пользователь указал дату, используем её, иначе — текущая дата
  if (userDate) {
    // Создаём дату из строки YYYY-MM-DD, используя локальное время
    const [year, month, day] = userDate.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = now;
  }

  let timeString: string;

  // Если пользователь указал время, используем его, иначе — текущее время
  if (userTime) {
    timeString = userTime;
  } else {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    timeString = `${hours}:${minutes}:${seconds}`;
  }

  // Форматируем дату в YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const fDate = `${year}-${month}-${day}`;

  // Убедимся, что время в формате HH:MM:SS
  const [hours, minutes, seconds] = timeString.split(':').map(part =>
    String(parseInt(part, 10)).padStart(2, '0')
  );
  const fTime = `${hours}:${minutes}:${seconds || '00'}`;

  return { fDate, fTime };
}
