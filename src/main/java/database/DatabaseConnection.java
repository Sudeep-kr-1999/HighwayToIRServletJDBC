package database;

public class DatabaseConnection {
	private static final String DB_URL = "jdbc:mysql://localhost:3306/highwaytoirdatabase";
	private static final String PASSWORD = "root";
	private static final String USER_NAME = "root";
	private static final String DRIVER = "com.mysql.cj.jdbc.Driver";

	public static String getDbURL() {
		return DB_URL;
	}

	public static String getUserName() {
		return USER_NAME;
	}

	public static String getPassword() {
		return PASSWORD;
	}

	public static String getDriver() {
		return DRIVER;
	}

}
