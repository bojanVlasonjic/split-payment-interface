package dipl.spi.spi_backend.exception;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ApiException extends RuntimeException {

    private HttpStatus status;
    private String message;

    public JsonNode getExceptionJson() {
        ObjectNode exceptionNode = new ObjectMapper().createObjectNode();

        exceptionNode.put("message", this.message);
        exceptionNode.put("code", this.getStatus().toString());
        exceptionNode.put("timestamp", LocalDateTime.now().toString());

        return exceptionNode;
    }

}