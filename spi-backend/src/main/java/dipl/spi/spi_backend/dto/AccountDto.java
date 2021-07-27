package dipl.spi.spi_backend.dto;

import dipl.spi.spi_backend.model.Account;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class AccountDto {

    private Long id;
    private Long userId;

    private String number;
    private String recipientName;
    private String recipientAddress;

}
