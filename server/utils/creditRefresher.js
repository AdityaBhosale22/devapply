export const refreshCreditsIfNeeded = async (userId) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM subscriptions
     WHERE user_id = $1
     AND status = 'active'
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  if (!rows.length) return;

  const sub = rows[0];

  const expiry = new Date(sub.end_date);
  const now = new Date();

  if (expiry < now) return; // handled elsewhere

  const { rows: userRows } = await pool.query(
    `SELECT credits_remaining FROM users WHERE id = $1`,
    [userId]
  );

  if (!userRows.length) return;

  const userCredits = userRows[0].credits_remaining;

  if (userCredits <= 0) {
    await pool.query(
      `UPDATE users
       SET credits_remaining = $1
       WHERE id = $2`,
      [sub.credits_allocated, userId]
    );
  }
};