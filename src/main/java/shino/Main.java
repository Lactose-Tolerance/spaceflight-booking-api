package shino;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Main {

    @GetMapping("/")
    public String home(){
        return "Welcome to New Horizons Spaceflight!";
    }
    
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
        System.out.println("Server running at http://localhost:8080");
    }
}
