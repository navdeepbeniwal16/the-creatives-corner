package Controllers;

import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "api", value = "/api")
public class ApiGateway extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Get is called...");
        JSONObject testObject = new JSONObject();
        testObject.put("firstname", "Navdeep");
        testObject.put("lastname", "Beniwal");
        sendSuccessResponse(testObject, response);

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    private void sendSuccessResponse(JSONObject jsonObject, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(200);

        PrintWriter out = response.getWriter();
        out.print(jsonObject);
        out.flush();
    }
}
