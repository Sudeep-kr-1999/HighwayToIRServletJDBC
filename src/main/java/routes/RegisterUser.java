package routes;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import database.DatabaseConnection;
import model.SetUserResponsModel;

@WebServlet("/RegisterUser")
public class RegisterUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String USER_NAME = DatabaseConnection.getUserName();
	private static final String PASSWORD = DatabaseConnection.getPassword();
	private static final String DB_URL = DatabaseConnection.getDbURL();
	private static final String DRIVER = DatabaseConnection.getDriver();
	private static Connection connection;
	private PreparedStatement preparedStatement;
	private String username;
	private String userEmail;
	private String userPassword;
	private int no_of_rows_affected;

	@Override
	public void init() throws ServletException {
		super.init();
		try {
			Class.forName(DRIVER);
			connection = DriverManager.getConnection(DB_URL, USER_NAME, PASSWORD);
			System.out.println(connection);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void destroy() {
		super.destroy();
		try {
			connection.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	private SetUserResponsModel addData(JsonObject jsonData) throws SQLException {
		SetUserResponsModel response = null;
		this.username = jsonData.get("username").getAsString();
		this.userEmail = jsonData.get("email").getAsString();
		this.userPassword = jsonData.get("password").getAsString();
		try {
			String postQuery = "INSERT INTO highwaytoirdatabase.usertable(user_email,user_username,user_password)VALUES(?,?,?)";
			this.preparedStatement = connection.prepareStatement(postQuery);
			this.preparedStatement.setString(1, this.userEmail);
			this.preparedStatement.setString(2, this.username);
			this.preparedStatement.setString(3, this.userPassword);
			this.no_of_rows_affected = this.preparedStatement.executeUpdate();
			response = new SetUserResponsModel(this.no_of_rows_affected);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			this.preparedStatement.close();
		}
		return response;

	}

	protected void doPost(HttpServletRequest serverrequest, HttpServletResponse serverresponse)
			throws ServletException, IOException {
		JsonObject data = new Gson().fromJson(serverrequest.getReader(), JsonObject.class);
		System.out.println(data);
		SetUserResponsModel finalResponse = null;
		try {
			finalResponse = this.addData(data);
			Gson gson = new Gson();
			String finalResponseJsonData = gson.toJson(finalResponse);
			serverresponse.setContentType("application/json");
			serverresponse.setCharacterEncoding("UTF-8");
			serverresponse.setStatus(HttpServletResponse.SC_OK);
			serverresponse.getWriter().print(finalResponseJsonData);
			System.out.println(finalResponseJsonData);
		} catch (Exception e) {
			serverresponse.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not Found");
			e.printStackTrace();
		} finally {
			serverresponse.getWriter().flush();
		}

	}

}
