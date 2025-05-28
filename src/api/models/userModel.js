// src/api/models/userModel.js
const db = require("../../config/db");

module.exports = {
  /**
   * Get all users (paginated)
   */
  async getAll(limit = 10, offset = 0) {
    const { rows } = await db.query(
      `SELECT id, email, country_code, phone_number, user_type_id, first_name, last_name, profile_picture 
      FROM users 
      WHERE deleted_at IS NULL 
      AND is_active = 1
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  /**
   * Get user by ID
   */
  async getById(id) {
    const { rows } = await db.query(
      `SELECT id, email, country_code, phone_number, first_name, last_name, profile_picture
       FROM users
       WHERE id = $1 
       AND deleted_at IS NULL
       AND is_active = 1`,
      [id]
    );
    return rows[0];
  },

  /**
   * Create new user
   */
  // async create(userData) {
  //   const { rows } = await db.query(
  //     `INSERT INTO users (
  //     email,
  //     password,
  //     country_code,
  //     phone_number,
  //     first_name,
  //     last_name,
  //     profile_picture
  //   ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  //   RETURNING id, email, first_name, last_name, created_at`,
  //     [
  //       userData.email,
  //       userData.password,
  //       userData.country_code || null, // Added country_code with fallback to null
  //       userData.phone_number || null,
  //       userData.first_name,
  //       userData.last_name,
  //       userData.profile_picture || null,
  //     ]
  //   );
  //   return rows[0];
  // },

  /**
   * Update user
   */
  async update(id, userData) {
    const { rows } = await db.query(
      `UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        profile_picture = COALESCE($3, profile_picture),
        updated_at = NOW()
      WHERE id = $4 AND deleted_at IS NULL
      RETURNING id, email, first_name, last_name, profile_picture`,
      [userData.first_name, userData.last_name, userData.profile_picture, id]
    );
    return rows[0];
  },

  /**
   * Soft delete user
   */
  async delete(id, password) {
    // First verify the password
    const { rows } = await db.query(
      `UPDATE users SET 
        deleted_at = NOW(), 
        is_active = 0 
       WHERE id = $1 
       AND password = crypt($2, password)
       AND deleted_at IS NULL
       RETURNING id, email, first_name, last_name, deleted_at`,
      [id, password]
    );
    return rows[0];
  },

  async getByEmail(email) {
    const { rows } = await db.query(
      `SELECT * FROM users 
         WHERE email = $1 
         AND deleted_at IS NULL
         AND is_active = 1`,
      [email]
    );
    return rows[0];
  },

  async getByUsername(username) {
    const { rows } = await db.query(
      `SELECT * FROM users 
         WHERE username = $1 
         AND deleted_at IS NULL
         AND is_active = 1`,
      [username]
    );
    return rows[0];
  },

  async getByPhone(phone_number) {
    const query =
      "SELECT * FROM users WHERE phone_number = $1 AND is_active = 1";
    const { rows } = await pool.query(query, [phone_number]);
    return rows[0];
  },

  async updateLastLogin(userId) {
    const query = "UPDATE users SET last_login = NOW() WHERE id = $1";
    await pool.query(query, [userId]);
  },

  /**
   * Update user password
   */
  async updatePassword(id, newPassword) {
    const { rows } = await db.query(
      `UPDATE users SET
        password = $1,
        updated_at = NOW()
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id, email, phone_number`,
      [newPassword, id]
    );
    return rows[0];
  },

  /**
   * Verify user password
   * @param {number} id - User ID
   * @param {string} password - Password to verify
   * @returns {boolean} True if password matches, false otherwise
   */
  async verifyPassword(id, password) {
    const { rows } = await db.query(
      `SELECT id FROM users 
     WHERE id = $1 
     AND password = $2
     AND deleted_at IS NULL
     AND is_active = 1`,
      [id, password]
    );
    return rows.length > 0; // Returns true if user with matching password exists
  },

}; // End of User Model
