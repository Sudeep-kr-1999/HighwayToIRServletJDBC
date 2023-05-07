package routes;

import java.io.IOException;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.sql.Connection;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import database.DatabaseConnection;
import model.GetUserModel;

@WebServlet("/GetUser")
public class GetUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String USER_NAME = DatabaseConnection.getUserName();
	private static final String PASSWORD = DatabaseConnection.getPassword();
	private static final String DB_URL = DatabaseConnection.getDbURL();
	private static final String DRIVER = DatabaseConnection.getDriver();
	private static Connection connection;
	private Statement statement;
	private ResultSet rs;

	public void init(ServletConfig config) throws ServletException {
		super.init();
		try {
			Class.forName(DRIVER);
			connection = DriverManager.getConnection(DB_URL, USER_NAME, PASSWORD);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void destroy() {
		super.destroy();
		try {
			connection.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	private ArrayList<GetUserModel> getUserDetails(String user_email) throws SQLException {
		ArrayList<GetUserModel> list = new ArrayList<GetUserModel>();
		try {
			String Query = "select * from highwaytoirdatabase.usertable where user_email=" + "\"" + user_email + "\"";
			this.statement = connection.createStatement();
			this.rs = this.statement.executeQuery(Query);
			while (rs.next()) {
				GetUserModel userModel = new GetUserModel(rs.getString("user_email"), rs.getString("user_username"));
				list.add(userModel);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			this.statement.close();
		}
		return list;

	}

	protected void doGet(HttpServletRequest servrerrequest, HttpServletResponse serverresponse)
			throws ServletException, IOException {
		String user_email = servrerrequest.getParameter("email");
		ArrayList<GetUserModel> response = new ArrayList<GetUserModel>();
		try {
			response = this.getUserDetails(user_email);
			serverresponse.setContentType("application/json");
			serverresponse.setCharacterEncoding("UTF-8");
			Gson gson = new Gson();
			String finalResponseJsonData = gson.toJson(response);
			serverresponse.getWriter().print(finalResponseJsonData);
			serverresponse.setStatus(HttpServletResponse.SC_OK);
			System.out.println(finalResponseJsonData);
		} catch (Exception e) {
			serverresponse.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not Found");
			e.printStackTrace();
		} finally {
			serverresponse.getWriter().flush();
		}
	}

}
